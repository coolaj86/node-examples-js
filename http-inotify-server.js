"use strict";
(function () {
  var connect = require('connect'),
    respondOnFileUpdate = require('./respondOnFileUpdate');

  function rest(app) {
    app.get('/', function (req, resp) {
      resp.writeHead("200");
      resp.write("Hello " + req.remoteAddress);
      resp.end();
    });

                                            // path, filename
    app.get('/file.txt', respondOnFileUpdate('.', 'file.txt'));
  }


  // accept http requests
  connect.createServer(
    connect.router(rest)
  ).listen('3000');
}());
