#!/usr/bin/env node
(function () {
  "use strict";
  
  // TODO client should handle ECONREF
  var net = require('net'),
    util = require('util');

  net.createServer(function (stream) {

    stream.setEncoding('binary');
    stream.setTimeout(256);

    stream.on('connect', function () {
      util.print("(o)");
      //stream.write('hello\r\n');
    });
    stream.on('data', function (data) {
      util.print("(d)");
      //stream.write(data);
    });
    stream.on('end', function () {
      util.print("(e)");
      //stream.write('goodbye\r\n');
      //stream.end(); // leak the connection
    });
    stream.on('close', function () {
      util.print("(c)\n");
    });
    stream.on('timeout', function () {
      util.print("(t)");
      stream.end();
    });
  }).listen("/tmp/node-unix-stream-server-test.sock");
}());
