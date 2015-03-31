var http = require('http');
var route = require('./route.js');
var qs = require('querystring');

function onRequest(req, res) {

  var full_body = '';

  req.on('data', function(chunk) {
    full_body += chunk;
    var body = '';
    route.route(req, res, body);
  });

  req.on('end', function() {
    route.route(req, res, full_body);
  });

}

var server = http.createServer(onRequest);
server.listen(3000);
