#!/usr/bin/env node
(function () {
  "use strict";

  var net = require('net'),
    server,
    Multicaster = require('./multicaster'),
    socket = '/tmp/node-multicast-test.sock',
    multicast = new Multicaster();
  

  setInterval(function () {
    var data = new Buffer(512 * 1024); // malloc()'s 512k of memory
    multicast.write(data); // send to all clients
  }, Math.floor(Math.random() * 17) + 120); // acquire data for ~128ms


  server = net.createServer(function (client) {
    console.log("Accepted New Client");

    multicast.add(client);
    client.setTimeout(1000); // timeout 1s

    client.on('error', function () {
      client.end();
    });

    client.on('timeout', function () {
      client.end();
    });

    client.on('end', function () {
      client.end();
    });
  })

  server.listen(socket);
}());

