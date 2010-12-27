#!/usr/bin/env node
(function () {
  "use strict";

  var net = require('net'),
    socket = '/tmp/node-mc-test.sock',
    multicast = new (require('./multicaster')),
    message = "Hello World",
    count = 0;

  function sendData() {
    multicast.write(message);
  }

  function attachClients() {
    var count = 5, i;
    for (i = 0; i < count; i += 1) {
      attachClient();
    }

    setTimeout(sendData, 1000);
    setTimeout(process.exit, 3000);
  }

  function attachClient() {
    var stream = net.createConnection(socket);

    stream.on('data', function (data) {
      if (message !== data.toString()) {
        console.log("Fail:", data.toString(), "!==", message);
      } else {
        console.log("Pass:", message);
      }
    });
  }

  net.createServer(function (client) {
    client.on('connect', function () {
      count += 1;
      multicast.add(client);
      if (multicast.size() !== count) {
        console.log("[BUG] count mismatch");
      } else {
        console.log("Pass: count match");
      }
    });

    client.on('close', function () {
      count -= 1;
      if (multicast.size() !== count) {
        console.log("possible count mismatch", count, multicast.size());
      }
    });

    client.on('data', function (chunk) {
      // ignore data
    });

  }).listen(socket, attachClients);
}());
