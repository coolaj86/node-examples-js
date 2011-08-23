(function () {
  "use strict";

  var net = require('net');

  net.createServer(function (stream) {
    stream.on('drain', function () {
      console.log('drain server');
    });
    stream.on('data', function (data) {
      stream.write("echo " + data.toString() + new Buffer(9096).toString());
    });
  }).listen('/tmp/node-drain-test.sock');
}());
