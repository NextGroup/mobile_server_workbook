var insert = require('./insert');
var select = require('./select');
var update = require('./update');
var remove = require('./delete');

exports.execute = (function(operation, table){
  var insert_operation = {
    'user'              : insert.user,
    'place'             : insert.place,
    'post'              : insert.post,
    'comment'           : insert.comment,
    'follow'            : insert.follow,
    'tag'               : insert.tag,
    'zipcode'           : insert.zipcode,
    'tag_in_zipcode'    : insert.tag_in_zipcode,
    'user_like_post'    : insert.user_like_post,
    'user_like_place'   : insert.user_like_place,
    'user_like_tag'     : insert.user_like_tag,
    'user_like_zipcode' : insert.user_like_zipcode,
    'user_read_post'    : insert.user_read_post
  };

  var select_operation = {
    'user'              : select.user,
    'place'             : select.place,
    'post'              : select.post,
    'comment'           : select.comment,
    'follow'            : select.follow,
    'tag'               : select.tag,
    'zipcode'           : select.zipcode,
    'tag_in_zipcode'    : select.tag_in_zipcode,
    'user_like_post'    : select.user_like_post,
    'user_like_place'   : select.user_like_place,
    'user_like_tag'     : select.user_like_tag,
    'user_like_zipcode' : select.user_like_zipcode,
    'user_read_post'    : select.user_read_post,
    'time'              : select.time
  };

  var update_operation = {
    'user'              : update.user,
    'place'             : update.place,
    'post'              : update.post,
    'comment'           : update.comment,
    'follow'            : update.follow,
    'tag'               : update.tag,
    'zipcode'           : update.zipcode,
    'tag_in_zipcode'    : update.tag_in_zipcode,
    'user_like_post'    : update.user_like_post,
    'user_like_place'   : update.user_like_place,
    'user_like_tag'     : update.user_like_tag,
    'user_like_zipcode' : update.user_like_zipcode,
    'user_read_post'    : update.user_read_post
  };

  var remove_operation = {
    'user'              : remove.user,
    'place'             : remove.place,
    'post'              : remove.post,
    'comment'           : remove.comment,
    'follow'            : remove.follow,
    'tag'               : remove.tag,
    'zipcode'           : remove.zipcode,
    'tag_in_zipcode'    : remove.tag_in_zipcode,
    'user_like_post'    : remove.user_like_post,
    'user_like_place'   : remove.user_like_place,
    'user_like_tag'     : remove.user_like_tag,
    'user_like_zipcode' : remove.user_like_zipcode,
    'user_read_post'    : remove.user_read_post
  };

  var handler = {
    'insert'  : insert_operation,
    'select'  : select_operation,
    'update'  : update_operation,
    'remove'  : remove_operation
  };

  return handler[operation][table];
});
