#!/usr/bin/env node

// This simply transfers 512kb across a tcp stream over and over again.

// Use this to test the speed on various systems.

// Note: This tests the transfer speed, not the overhead of the connection
(function () {
  "use strict";

  require('../buffer-add-chunk');

  var net = require('net'),
    size = 512 * 1024,
    host = 'localhost',
    port = 4281,
    Futures = require('futures'),
    message = new Buffer(size),
    server;

  function attachClients() {
    var i, seq = Futures.sequence();
    for (i = 0; i < 5; i += 1) {
      seq.then(function (next) {
        setTimeout(function () {
          attachClient();
          next();
        }, 100);
      });
    }
    seq(function (n) {n()});
  }

  function attachClient() {
    var time,
      data = new Buffer(size),
      stream = net.createConnection(host, port);

    stream.on('close', function () {
      console.log("closed");
    });

    stream.on('end', function () {
      console.log("ended");
    });

    stream.on('connect', function () {
      console.log("connected");
      time = (new Date()).valueOf();
    });

    stream.on('data', function (chunk) {
      //console.log("data", data.__addchunk_index);
      var result = data.addChunk(chunk);
      if (undefined === result) {
        return;
      }
      if (true !== result) {
        console.log("[BUG] Inexact amount of data transferred");
        return;
      }

      stream.end();
      console.log('Transferred in', ((new Date()).valueOf() - time) + 'ms');
    });
  }

  server = net.createServer(function (client) {
    client.on('connect', function () {
      client.write(message);
    });

    client.on('end', function () {
      client.end();
    });
  })

  server.listen(host, port, attachClients);

  setTimeout(function () {
    console.log("closing...");
    server.close();
  }, 1000);
}());
