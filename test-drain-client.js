(function () {
  "use strict";

  var net = require('net'),
    stream = net.createConnection('/tmp/node-drain-test.sock');

  stream.on('drain', function () {
    console.log('drain client');
    stream.write('hello');
  });
  stream.on('data', function (data) {
    console.log(data.toString());
  });
}());
