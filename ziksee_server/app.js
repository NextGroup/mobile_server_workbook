var express = require('express');
var fs = require('fs');
var colors = require('colors');
var bodyParser = require('body-parser');
var multer = require('multer');
var easyimg = require('easyimage');
var setting = require('./config/setting');
var db = require('./db/handler');
var s3 = require('./imageServer');
var mqtt = require('mqtt');
var async = require('async');
var client = mqtt.createClient(setting.mqtt.port, setting.mqtt.broker);

client.on('connect', function() {
    client.subscribe('currentLocatioin');
});
client.on('message', function(topic, payload) {
   console.log(topic, payload);
});

var app = express();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(multer()); 


/**
 * Send asyncronously a user the posts uploaded at the given area requested by him when the request route path is equal to '/get/post'
 *
 * 'function(req, res)' - Callback function called when GET request path is '/'
 * @param {Object[]} req- request 
 * @param {Object} req.query - request query 
 * @param {number} req.query.northEastLat
 * @param {number} req.query.northEastLog
 * @param {number} req.query.southWestLat
 * @param {number} req.query.southWestLog
 *
 * 'res.send()' - respond to the user with param 
 * @param {Object[]} rows - array of posts on the given area 
 */
app.get('/get/post', function(req, res) {
    console.log("[GET] Post, query : %j".red, req.query);
    db.execute('select', 'post')(req.query, function(rows){
      if(rows.length == 0){
        res.end("[]");
      } else{
        res.send(rows);
        res.end();
      }
    });
});

/**
 * Send asyncronously a user the current time of the DB server when he requests with the route path equal to '/get/time'
 *
 * 'function(req, res)' - Callback function called when GET request path is '/time'
 *
 * 'res.send()'
 * @param {string} - CURRENT_TIME of DB server 
 */
app.get('/get/time', function(req, res) {
  console.log("[GET] Time");
  db.execute('select', 'time')(null, function(rows){
	res.send(rows[0]['NOW()']);
	res.end();
  });
});

/**
 * Find asyncronously the userPenName corresponding to parameter userId from the DB server,
 * then send userPenName back to the client. Called with the route path equal to '/get/user'
 *
 * 'function(req, res)' - Callback function called when GET request path is '/time'
 *
 * 'res.send()'
 * @param {string} - CURRENT_TIME of DB server 
 */
app.get('/get/user', function(req, res) {
  console.log("[GET] User");
  db.execute('select', 'user')(req.query, function(userPenName){
    res.send(userPenName);
    res.end();
  });
});
/**
 * Send asyncronously a user the comments of the post whose postId equals the given parameter 
 *
 * 'function(req, res)' - Callback function called when GET request path is '/get/comment'
 * @param {number} req.query
 * @param {number} req.query.postId
 *
 * 'res.send()'
 * @param {Object[]} - the comments about the given post 
 */
app.get('/get/comment', function(req, res) {
  console.log("[GET] Comment, postId = %s".red, req.query.commentPostId);
  db.execute('select', 'comment')(req.query, function(rows){
    res.send(rows);
    res.end();
  });
});

// test for DB Select Module
app.get('/push', function(req, res) {
    console.log("[GET] Push, query : %j".red, req.query);
    db.execute('select', 'post')(req.query, function(rows){
	console.log(rows);
	res.send(rows);
	res.end();
    });
});


// TODO : change this module as a module for redirection to S3 server
/**
 * Send asyncronously a user the image file of the post whose postId equals the given parameter 
 *
 * 'function(req, res)' - Callback function called when GET request path is '/get/image'
 * @param {number} req.query
 * @param {number} req.query.filename - image file name
 *
 * 'res.end()'
 * @param {Object} img - the image file of the given post 
 */
app.get('/get/image', function(req, res) {
    var filename = req.query.filename;
    console.log("[GET] Image, requested filename : %s".yellow, filename);
    var img = fs.readFileSync(__dirname + "/uploads/" + filename);
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
});

/**
 * Insert the request parameter post into DB asynchronously and send the postId back to client on completion
 *
 * 'function(req, res)' - Callback function called when POST request path is '/upload/post'
 * @param {Object} req.body
 * @param {number} req.body.postId
 * @param {string} req.body.postText
 * @param {string} req.body.postImage
 * @param {number} req.body.postLat
 * @param {number} req.body.postLon
 */
app.post('/upload/post', function(req, res) {
    var path = req.files.postImageFile.path;
    console.log("[POST] Post, imageFileName : %s".blue, path);
    var imageName = "" + req.body.postLat + '_' + req.body.postLon + '_' + req.body.userId;
    s3.send(path, imageName);
    req.body['imageName'] = imageName;
    db.execute('insert', 'post')(req.body, (function(postId){
      console.log("postId : ", postId);
      res.end("postId:" + postId);
    }))
});

/**
 * Insert the request parameter comment into DB asynchronously and send the commentId back to client on completion
 *
 * 'function(req, res)' - Callback function called when POST request path is '/upload/comment'
 * @param {Object} req.body
 * @param {string} req.body.commentUserId
 * @param {string} req.body.commentPostId
 * @param {string} req.body.commentText
 */
app.post('/upload/comment', function(req, res) {
    console.log("[POST] Comment, req.body : %j".green, req.body);
    db.execute('insert', 'comment')(req.body, function(){res.end()});
});

/**
 * Insert the record that the given user like the given post into DB asynchronously
 *
 * 'function(req, res)' - Callback function called when POST request path is '/upload/like'
 * @param {Object} req.body
 * @param {string} req.body.userId
 * @param {string} req.body.postId
 */
app.post('/upload/like', function(req, res) {
    console.log("[POST] Like, req.body : %j".green, req.body);
    db.execute('insert', 'Like')(req.body, function(){res.end()});
});

/**
 * Insert or Replace the request parameter user into DB asynchronously
 *
 * 'function(req, res)' - Callback function called when POST request path is '/upload/user'
 * @param {Object} req.body
 * @param {string} req.body.userId
 * @param {string} req.body.userName
 */
app.post('/upload/user', function(req, res) {
    console.log("[POST] User, req.body : %j".green, req.body);
    db.execute('insert', 'user')(req.body, function(){res.end()});
});

/**
 * Delete the record that the givne user likes the given post on DB asynchronously
 *
 * 'function(req, res)' - Callback function called when POST request path is '/delete/like'
 * @param {Object} req.body
 * @param {string} req.body.userId
 * @param {string} req.body.postId
 */
app.post('/delete/like', function(req, res){
    console.log("[DELETE] Like, req.body : %j".red, req.body);
    db.execute('delete', 'like')(req.body, function(){res.end()});
});

app.listen(7777);
