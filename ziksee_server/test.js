var db = require('./db/handler');
var testPost = {
  'userName' : '김기렴',
  'commentPostId' : 3,
  'postUserId' : 'kimkr',
  'postText' : 'text',
  'postImage' : 'image',
  'postLat' : '37.121212',
  'postLon' : '129.1212121',
  'northEastLat' : '38',
  'northEastLon' : '129',
  'southWestLat': '37',
  'southWestLon' : '130',
};
db.execute('select', 'user')(testPost, function(ret){console.log(ret)});
//db.execute('insert', 'post')(testPost, function(ret){console.log(ret)});
//db.execute('select', 'post')(testPost, function(ret){console.log(ret)});
//db.execute('select', 'comment')(testPost, function(ret){console.log(ret)});
