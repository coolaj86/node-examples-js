#!/usr/bin/env node
(function (undefined) {
  "use strict";
  
  process.title = "node-unix-stream-client-test";

  var net = require('net'),
    util = require('util'),
    o_count = 0,
    c_count = 0,
    e_count = 0,
    started_at = (new Date()).toISOString();

  // If too many clients connect without
  // closing, the server will quite accepting
  // connections
  function newClient() {
    var stream = net.createConnection('/tmp/node-unix-stream-server-test.sock');

    stream.setEncoding("binary");
    stream.setTimeout("256");
    stream.on("connect", function () {
      o_count += 1;
      util.print("[O]");
      stream.write("Heya\r\n");
    });
    stream.on("data", function (data) {
      util.print("[D]");
      // stream.end();
      // do nothing, let the connection timeoutstream.write(data);
    });
    stream.on("end", function () {
      util.print("[E]");
    });
    stream.on("close", function () {
      e_count = 0;
      util.print("[C]\n");
    });
    stream.on("timeout", function () {
      util.print("[T]");
      stream.end();
    });
    stream.on("error", function (err) {
      util.print('[X]');
      e_count += 1;
      //if (e_count > 10) {
        console.log("Started on:", started_at);
        console.log("total descriptors opened:", o_count);
        console.log("total descriptors closed:", c_count);
        console.log("Ended on:", (new Date()).toISOString());
        process.exit();
      //}
    });
  }

  process.addListener("uncaughtException", function (err) {
    var fs = require('fs');
    util.print('[#]');
    console.log("something unexpected happened"+ JSON.stringify(err));
    fs.writeFileSync("/tmp/node-unix-stream-client-test-" + process.pid + ".log", JSON.stringify(err));
    process.exit();
  });

  setInterval(newClient, 128);
}());
