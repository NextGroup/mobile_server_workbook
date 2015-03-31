var db = require("./mongodb");
var setting = require('./config/setting');
var collection = setting.collection;
var querystring = require('querystring');
var url = require('url');

exports.create = function(req, res, body) {
  if(body.length > 0) {
    _insertMemo(body, function(error, result) {
        if(error) throw error;
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write('creatememo');
        res.end();
    });
  }
};

exports.read = function(req, res) {
  _findMemo({}, {}, function(error, results) {
      if(error) throw error;
      res.writeHead(200, {"Content-Type": "application/json"});
      res.write(JSON.stringify(results));
      console.log(JSON.stringify(results));
      res.end();
  });
};

exports.update = function(req, res, body) {
  var query = querystring.parse(url.parse(req.url).query);
  if(body.length > 0) {
    _updateMemo(query, body, function(error, results) {
        if(error) throw error;
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write('updatememo');
        res.end();
    });
  }
};

exports.remove = function(req, res) {
  var query = querystring.parse(url.parse(req.url).query);
  console.log("%j", query);

  _removeMemo(query, function(error, results) {
      if(error) throw error;
      res.writeHead(200, {"Content-Type": "application/json"});
      res.write(results);
      res.end();
  });
};


function _insertMemo (body, callback) {
  var bodyObj = JSON.parse(body);
  var memo = {
    author: bodyObj.author,
    memo: bodyObj.memo,
    date: new Date()
  };
  console.log("memo");
  console.log("%j", memo);
  db.insert(collection, memo, callback);
}

function _findMemo (condition, projection, callback) {
  condition = condition || {};
  projection = projection || {};
  db.find(collection, condition, projection, callback);
}

function _updateMemo (query, body, callback) {
  var bodyObj = JSON.parse(body);
  console.log("%j", bodyObj);
  db.update(collection, query, bodyObj, callback);
}

function _removeMemo (query, callback) {
  db.remove(collection, query, callback);
}
