#!/usr/bin/env node
(function () {
  "use strict";
  
  // TODO cliest should handlee ECONREF
  var net = require('net');

  net.createServer(function (stream) {
    stream.setEncoding('binary');
    stream.setTimeout(256);
    stream.on('connect', function () {
      //stream.write('hello\r\n');
    });
    stream.on('data', function (data) {
      //stream.write(data);
    });
    stream.on('end', function () {
      console.log("client ended");
      //stream.write('goodbye\r\n');
      //stream.end(); // leak the connection
    });
    stream.on('timeout', function () {
      //console.log("not closing, allowing to leak");
      console.log("client went inactive");
      stream.end();
    });
  }).listen("/tmp/node-unix-stream-server-test.sock");
}());
