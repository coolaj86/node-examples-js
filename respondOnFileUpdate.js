"use strict";
(function () {
  var inotify = require("inotify-plusplus").create(),
    connect = require("connect");
    fs = require("fs"),
    clients = [];

  // TODO bundle with inotify++
  inotify.watchFiles = function (directive, path, files, options) {
    if ('string' === typeof files) {
      files = [files];
    }
    Object.keys(directive).forEach(function (ioevent) {
      var original_responder = directive[ioevent];
      directive[ioevent] = undefined;

      directive[ioevent] = function (ev) {
        console.log(ev);
        files.forEach(function (filename) {
          if (filename !== ev.name) { return };
          original_responder(ev);
        });
      }
    });
    inotify.watch(directive, path, options);
  };

  function pumpToClients(clients, readStream) {
    //console.log("pumpToClients");
    var ipaddrs = Object.keys(clients);

    ipaddrs.forEach(function (ip) {
      var client = clients[ip];

      client.resp.writeHead("200");

      readStream.on('data', function (data) {
        client.resp.write(data);
      });

      readStream.on('end', function () {
        client.resp.end();
      });
    });
  }

  function respondOnFileUpdate(path, name) {
    inotify.watchFiles({
      close_write: function (ev) {
        var file = fs.createReadStream(path + '/' + name);
        pumpToClients(clients, file);
      }
    }, path, ["file.txt"]);

    return function (req, resp) {
      var client = clients[req.socket.remoteAddress] = clients[req.socket.remoteAddress] || {};
      client.req = req;
      client.resp = resp;
      client.timestamp = (new Date()).valueOf();
    };
  }

  module.exports = respondOnFileUpdate;
  //module.exports = pumpToClients;

}());
