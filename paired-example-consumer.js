#!/usr/bin/env node
(function () {
  "use strict";

  require('./buffer-add-chunk');

  var net = require('net'),
    queue = [],
    size = 512 * 1024,
    ready = true,
    socket = '/tmp/node-multicast-test.sock';

  function dummy_process_data() {
    if (!ready) {
      return;
    }
    if (0 === queue.length) {
      return;
    }

    var data = queue.pop();
    console.log("processing data...");
    ready = false;
    setTimeout(function () {
      ready = true;
      dummy_process_data();
    }, Math.floor(Math.random() * 51) + 100); // process data for ~125ms
  }

  function handleFrame(data) {
    get_socket_data();

    // keep only the most recent data
    while (queue.length > 2) {
      // TODO BUG: this still causes the array to grow
      // even though it's being "popped", in a sense
      console.log("[!] skipping a frame of data");
      queue.shift();
    }
    queue.push(data);

    dummy_process_data();
  }

  function get_socket_data() {
    var started = (new Date()).valueOf();
      data = new Buffer(size), // 512kb buffer
      stream = net.createConnection(socket);

    stream.on('close', function () {
      console.log("cleanly disconnected");
    });

    stream.on('end', function () {
      stream.end();
    });

    stream.on('data', function (chunk) {
      var remnant = data.addChunk(chunk);
      if (undefined === remnant) {
        return;
      }

      if (true === remnant) {
        handleFrame(data);
        stream.end();
        return;
      }

      // Errors
      if (false === remnant) {
        stream.end();
        console.log("[BUG] adding much more data than expected");
        return;
      }
      if (remnant && remnant.length) {
        stream.end();
        console.log("[BUG] adding too much data");
        return;
      }

      console.log("[BUG] unknown condition");
    });
  }

  get_socket_data();
}());

