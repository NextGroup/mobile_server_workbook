var http = require('http'),
    util = require('util'),
    path = require('path'),
    url = require('url'),
    fs   = require('fs'),
    mime = require('mime'),
    querystring = require('querystring'),
    formidable = require('formidable'),
    mongo = require('./mongodb'),
    collection = require('./config/setting').collection,
    UPLOAD_DIR = "./upload/";

exports.create = function(req, res, body) {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
      '<form action="/upload" enctype="multipart/form-data" method="post">'+
      '<input type="text" name="title"><br>'+
      '<input type="file" name="upload" multiple="multiple"><br>'+
      '<input type="submit" value="Upload">'+
      '</form>'
    );
};

exports.upload = function(req, res, body) {
  console.log(body);
  var form = new formidable.IncomingForm(),
             files = [],
             fields = [];
  console.log("execute !! upload folder ")
  form.keepExtensions = true;
  form.uploadDir = UPLOAD_DIR;
  console.log(form.uploadDir);
  form
    .on('field', function(field, value) {
      console.log(field, value);
      fields.push([field, value]);
    })
    .on('fileBegin', function(name, file) {
      file.path = form.uploadDir + "/" + file.name;
    })
    .on('file', function(field, file) {
      console.log(field, file);
      files.push([field, file]);
    })
    .on('progress', function(bytesReceived, bytesExpected) {
        console.log('progress: ' + bytesReceived + '/' + bytesExpected);
    })
    .on('end', function() {
        console.log('-> upload done');
        console.log(JSON.stringify(util.inspect(files)));
    });
   form.parse(req, function(err, fields, files) {
     res.writeHead(200, {'content-type': 'application/json'});
     console.log('parse - ' + JSON.stringify(files));
     res.end(JSON.stringify(files));
     mongo.insert(collection, fields, function(err, mesg) {
       if(err) throw err;
       console.log(mesg)});
   });
};

exports.read = function(req, res, body) {
  var query = url.parse(req.url).query;
  var where = querystring.parse(query);
  console.log( "querystring(req.url)['path'] " +  querystring.parse(query)['path']) ;
  var vpath = querystring.parse(query)['path'];
  console.log(vpath);
  if (vpath.length > 0) {
     console.log (vpath);
     fs.readFile('./upload/' + vpath ,function(err,data){
       if (err) { 
         res.writeHead(404, {'content-type': 'text/plain'});
         res.end('404');
       }
       res.writeHead(200, {'Content-Type':'image/jpeg'});
       res.end(data);
     });
  }
};

exports.error  = function(req, res, body) {
  res.writeHead(404, {'content-type': 'text/plain'});
  res.end('404');
};
