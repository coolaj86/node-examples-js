(function () {
  "use strict";

  var http = require('http'),
    port = 4080,
    host = 'localhost',
    path = '/',
    options = {
      host: host,
      port: port,
      path: path
    };


  // Run Server
  http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
  }).listen(port, host);
  console.log('Server running at http://' + host + ':' + port);


  // Run Client against Server
  function poll() {
    http.get(options, function(res) {
      console.log("Got response: " + res.statusCode);
      res.on('data', function (data) {
        console.log(data.toString());
      });
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  }
  setInterval(poll, 100);

}());
