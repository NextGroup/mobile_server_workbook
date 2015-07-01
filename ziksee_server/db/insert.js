var mysql = require('mysql');
var setting = require('../config/setting');
var connection = mysql.createConnection({
    host      : setting.mysql.host,
    port      : setting.mysql.port,
    user      : setting.mysql.user,
    password  : setting.mysql.password,
    database  : setting.mysql.database,
    query     : { pool : true }
})
connection.connect();

exports.user = function(data, callback) {
  var sql = "INSERT INTO user (userId, userName, userPenName) values (?, ?, ?)";
  var args = [data.userId, data.userName, data.userPenName]; 
  var sqlCallback = function(err, rows, field){
    if(err){
      console.log(err);
    }
    callback(rows);
  };
  connection.query(sql, args, sqlCallback);
};

exports.post = function(data, callback) {
  console.log("db data : ", data);
  var postLat = parseFloat(data.postLat);
  var postLon = parseFloat(data.postLon);
  var sql = "INSERT INTO post (postUserId, postText, postImage, postLat, postLon) values (?, ?, ?, ?, ?)";
  var args = [data.postUserId, data.postText, data.imageName, data.postLat, data.postLon]; 
  var sqlCallback = function(err, result){
    if(err){
      console.log(err);
    }
    callback(result.insertId);
  };
  connection.query(sql, args, sqlCallback);
};

exports.place = function(data, callback) {
  var sql = "INSERT INTO place (placeName, placeLat, placeLon) values (?, ?, ?)";
  var args = [data.placeName, data.placeLat, data.placeLon]; 
  var sqlCallback = function(err, rows, field){
    if(err){
      console.log(err);
    }
    callback(rows);
  };
  connection.query(sql, args, sqlCallback);
};

exports.comment = function(data, callback) {
  var sql = "INSERT INTO comment (commentUserId, commentPostId, commentText) values (?, ?, ?)";
  var args = [data.commentUserId, data.commentPostId, data.commentText]; 
  var sqlCallback = function(err, rows, field){
    if(err){
      console.log(err);
    }
    callback(rows);
  };
  connection.query(sql, args, sqlCallback);
};

exports.follow = function(data, callback) {
  var sql = "INSERT INTO follow (userId, followId) values (?, ?)";
  var args = [data.userId, data.followId]; 
  var sqlCallback = function(err, rows, field){
    if(err){
      console.log(err);
    }
    callback(rows);
  };
  connection.query(sql, args, sqlCallback);
};

exports.tag = function(data, callback) {
  var sql = "INSERT INTO tag (tagId) values (?)";
  var args = [data.tagId]; 
  var sqlCallback = function(err, rows, field){
    if(err){
      console.log(err);
    }
    callback(rows);
  };
  connection.query(sql, args, sqlCallback);
};

exports.zipcode = function(data, callback) {
  var sql = "INSERT INTO zipcode (zipcodeId) values (?)";
  var args = [data.zipcodeId]; 
  var sqlCallback = function(err, rows, field){
    if(err){
      console.log(err);
    }
    callback(rows);
  };
  connection.query(sql, args, sqlCallback);
};

exports.tag_in_zipcode = function(data, callback) {
  var sql = "INSERT INTO tag_in_zipcode (tagId, zipcodeId) values (?, ?)";
  var args = [data.tagId, data.zipcodeId]; 
  var sqlCallback = function(err, rows, field){
    if(err){
      console.log(err);
    }
    callback(rows);
  };
  connection.query(sql, args, sqlCallback);
};

exports.user_like_post = function(data, callback) {
  var sql = "INSERT INTO user_like_post (userId, postId) values (?, ?)";
  var args = [data.userId, data.postId]; 
  var sqlCallback = function(err, rows, field){
    if(err){
      console.log(err);
    }
    callback(rows);
  };
  connection.query(sql, args, sqlCallback);
};

exports.user_like_place = function(data, callback) {
  var sql = "INSERT INTO user_like_place (userId, placeId) values (?, ?)";
  var args = [data.userId, data.placeId]; 
  var sqlCallback = function(err, rows, field){
    if(err){
      console.log(err);
    }
    callback(rows);
  };
  connection.query(sql, args, sqlCallback);
};

exports.user_like_tag = function(data, callback) {
  var sql = "INSERT INTO user_like_tag (userId, tagId) values (?, ?)";
  var args = [data.userId, data.tagId]; 
  var sqlCallback = function(err, rows, field){
    if(err){
      console.log(err);
    }
    callback(rows);
  };
  connection.query(sql, args, sqlCallback);
};

exports.user_like_zipcode = function(data, callback) {
  var sql = "INSERT INTO user_like_zipcode (userId, zipcodeId) values (?, ?)";
  var args = [data.userId, data.zipcodeId]; 
  var sqlCallback = function(err, rows, field){
    if(err){
      console.log(err);
    }
    callback(rows);
  };
  connection.query(sql, args, sqlCallback);
};

exports.user_read_post = function(data, callback) {
  var sql = "INSERT INTO user_read_post (userId, postId) values (?, ?)";
  var args = [data.userId, data.postId]; 
  var sqlCallback = function(err, rows, field){
    if(err){
      console.log(err);
    }
    callback(rows);
  };
  connection.query(sql, args, sqlCallback);
};
