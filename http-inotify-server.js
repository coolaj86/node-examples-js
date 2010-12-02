"use strict";
(function () {
  var connect = require('connect'),
    respondOnFileUpdate = require('./http-inotify-util').respondOnFileUpdate;

  function rest(app) {
    app.get('/', function (req, resp) {
      resp.writeHead("200");
      resp.write("<pre>")
      console.log(req);
      resp.write("Hello " + req.socket.remoteAddress + "\n\n");
      resp.write("Visit <a href='file.txt'>file.txt</a> " + 
        "and then place content in the file of the same name.\n\n" +
        "The response will not occur until you have written the file");
      resp.write("</pre>");
      resp.end();
    });

                                            // path, filename
    app.get('/file.txt', respondOnFileUpdate('.', ['file.txt']));
  }


  // accept http requests
  connect.createServer(
    connect.router(rest)
  ).listen('3000');
}());
