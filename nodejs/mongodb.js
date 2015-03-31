var setting = require('./config/setting.json');
var MongoClient = require('mongodb').MongoClient;
var database = setting.database; 

exports.insert = function(table, jsondata, callback) {
  MongoClient.connect(database, function(err, db) {
    if(err) throw err;
    db.collection(table).insert(jsondata, function(err, data) {
      if(err) throw err;
      console.dir("Successfully inserted : " + JSON.stringify(data));
      callback(db.close(), "Successfully inserted!");
    });
  });
};

exports.find = function(table, query, projection, callback) {
  MongoClient.connect(database, function(err, db) {
    if(err) throw err;
    db.collection(table).find(query, projection).toArray(function(err, docs) {
      if(err) throw err;
      docs.forEach(function(doc) {
        console.dir(doc);
      });
      callback(db.close(), docs);
    });
  });
};

exports.remove = function(table, query, callback) {
  MongoClient.connect(database, function(err, db) {
    if(err) throw err;
    db.collection(table).remove(query, function(err, removed) {
      if(err) throw err;
      var mesg = "Successfully removed " + removed + " documents!";
      console.log(mesg);
      callback(db.close(), "Successfully removed!");
    });
  });
};

exports.update = function(table, query, operator, callback) {
  MongoClient.connect(database, function(err, db) {
    if(err) throw err;
    db.collection(table).update(query, operator, function(err, updated) {
      if(err) throw err;
      console.dir("Successfully updated " + updated + " documents!");
      callback(db.close(), "Successfully updated!");
    });
  });
};

