#!/usr/bin/env node
(function (undefined) {
  "use strict";
  
  process.title = "node-unix-stream-client-test";

  var net = require('net'),
    util = require('util');

  // If too many clients connect without
  // closing, the server will quite accepting
  // connections
  function newClient() {
    var stream = net.createConnection('/tmp/node-unix-stream-server-test.sock');

    stream.setEncoding("binary");
    stream.setTimeout("256");
    stream.on("connect", function () {
      util.puts("[O]");
      stream.write("Heya\r\n");
    });
    stream.on("data", function (data) {
      util.puts("[D]");
      // stream.end();
      // do nothing, let the connection timeoutstream.write(data);
    });
    stream.on("end", function () {
      util.puts("[E]");
    });
    stream.on("close", function () {
      util.puts("[C]\n");
    });
    stream.on("timeout", function () {
      stream.end();
      util.puts("[T]");
    });
  }

  process.addListener("uncaughtException", function (err) {
    var fs = require('fs');
    util.puts('[X]');
    //console.log("something unexpected happened"+ JSON.stringify(err));
    //fs.writeFileSync("/tmp/node-unix-stream-client-test-" + process.pid + ".log", JSON.stringify(err));
  });

  setInterval(newClient, 128);
}());
