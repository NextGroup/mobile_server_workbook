var url = require('url');
var memoHandler = require('./memoHandler.js');
var imageUpload = require('./imageUploader.js');

exports.route = (function() {

  var handler = {};

  handler['/memo'] = {
    POST: memoHandler.create,
    GET:memoHandler.read,
    PUT:memoHandler.update,
    DELETE:memoHandler.remove,
  };
  handler['/upload'] = {
    POST: imageUpload.upload,
    GET: imageUpload.read,
    PUT: imageUpload.error,
    REMOVE: imageUpload.error
  };
  handler['/'] = {
    POST: imageUpload.create,
    GET: imageUpload.create,
    PUT: imageUpload.create,
    REMOVE: imageUpload.create
  };

  function route(req, res, body) {
    var pathname = url.parse(req.url).pathname;
    var method = req.method.toUpperCase();

    if(typeof handler[pathname][method] == 'function') {
      handler[pathname][method](req, res, body);
    } else {
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.write('pathname error');
      res.end();
    }
  }
  return route;
})();
