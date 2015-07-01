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
  if(data.userId != null){
    sql = 'SELECT userPenName FROM user WHERE userId=?';
    args = [data.userId];
  } else if(data.userName){
    sql = 'SELECT * FROM user WHERE userName=?';
    args = [data.userName];
  } else{
    callback();
    return;
  }
  var sqlCallback = function(err, rows, field){
    if(err){
      console.log(err);
    }
    callback(rows[0]);
  };
  connection.query(sql, args, sqlCallback);
};

exports.post = function(data, callback) {
  if(data.userId!=null && data.northEastLat!=null && data.northEastLon!=null && data.southWestLat!=null && data.southWestLon!=null){
    sql = 'SELECT postUserId, postTime, post.postId, postText, postImage, postLat, postLon, likeCount, commentCount, userLikePost '+
      'FROM post ' + 
      'LEFT OUTER JOIN(SELECT postId, count(*) userLikePost FROM user_like_post WHERE userId=?) AS B ON post.postId = B.postId ' +
      'LEFT OUTER JOIN (SELECT postId, count(*) likeCount FROM user_like_post GROUP BY(postId)) AS L ON post.postId = L.postId ' +
      'LEFT OUTER JOIN (SELECT commentPostId, count(*) commentCount FROM comment GROUP BY(commentPostId)) AS C ' +
      'ON post.postId=C.commentPostId WHERE postLat < ? AND postLon < ? AND postLat > ? AND postLon > ? ORDER BY postTime DESC LIMIT ?';
    args = [data.userId, data.northEastLat, data.northEastLon, data.southWestLat, data.southWestLon, setting.mysql.selectlimit];
  } else if(data.postUserId){
    sql = 'SELECT * FROM post WHERE postUserId = ? ORDER BY postTime DESC LIMIT ?'
    args = [data.postUserId, setting.mysql.selectlimit];
  } else{
    callback("error");
    return;
  }
  var sqlCallback = function(err, rows, field){
    if(err){
      console.log(err);
    }
    callback(rows);
  };
  connection.query(sql, args, sqlCallback);
};

exports.comment = function(data, callback) {
  if(data.commentPostId != null && data.countFlag != null) {
    sql = 'SELECT COUNT(*) AS commentCount FROM comment WHERE commentPostId=?';
    args = [data.commentPostId];
  } else if(data.commentPostId != null){
    sql = 'SELECT * FROM comment WHERE commentPostId=?';
    args = [data.commentPostId];
  } else if(data.commentUserId != null){
    sql = 'SELECT * FROM comment WHERE commentUserId=?'
    args = [data.commentUserId];
  } else{
    callback("error");
    return;
  }
  var sqlCallback = function(err, rows, field){
    if(err){
      console.log(err);
    }
    callback(rows);
  };
  connection.query(sql, args, sqlCallback);
};

exports.follow = function(data, callback) {
  if(data.userId != null){
    sql = 'SELECT followId FROM follow WHERE userId=?';
    args = [data.userId];
  } else{
    callback("error");
    return;
  }
  var sqlCallback = function(err, rows, field){
    if(err){
      console.log(err);
    }
    callback(rows);
  };
  connection.query(sql, args, sqlCallback);
};

exports.user_like_tag = function(data, callback) {
  if(data.userId != null){
    sql = 'SELECT tagId FROM user_like_tag WHERE userId = ?';
    args = [data.userId];
  } else{
    callback("error");
    return;
  }
  var sqlCallback = function(err, rows, field){
    if(err){
      console.log(err);
    }
    callback(rows);
  };
  connection.query(sql, args, sqlCallback);
};

exports.user_like_post = function(data, callback) {
  if(data.userId != null && data.postId != null){
    sql = 'SELECT COUNT(*) AS userLikePost FROM user_like_post WHERE userId = ? AND postId = ?';
    args = [data.userId, data.postId];
  } else if(data.postId){
    sql = 'SELECT COUNT(*) AS likeCount FROM user_like_post WHERE postId = ?';
    args = [data.postId];
  } else{
    callback("error");
    return;
  }
  var sqlCallback = function(err, rows, field){
    if(err){
      console.log(err);
    }
    callback(rows);
  };
  connection.query(sql, args, sqlCallback);
};

exports.time = function(data, callback) {
  var sql = 'SELECT NOW()';
  var args = [];
  var sqlCallback = function(err, rows, field){
    if(err){
      console.log(err);
    }
    callback(rows);
  };
  connection.query(sql, args, sqlCallback);
};

