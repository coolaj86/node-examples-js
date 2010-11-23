"use strict";
(function () {
  var inotify = require("inotify-plusplus").create(),
    connect = require("connect");
    fs = require("fs");

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
    return inotify.watch(directive, path, options);
  };

  function pumpToClients(clients, readStream) {
    //console.log("pumpToClients");
    var keys = Object.keys(clients);

    keys.forEach(function (ip) {
      var client = clients[ip];

      client.resp.writeHead("200");

      readStream.on('data', function (data) {
        client.resp.write(data);
      });

      readStream.on('end', function () {
        client.resp.end();
        client[ip] = undefined;
        delete client[ip];
      });
    });
  }

  function respondOnFileUpdate(path, names) {
    if ('string' === typeof names) {
      names = [names];
    }
    var clients = {};
    //clients.pump = function (stream) {
    //  pumpToClients(clients, stream)
    //};
    inotify.watchFiles({
      close_write: function (ev) {
        var file = fs.createReadStream(path + '/' + ev.name);
        //clients.pump(file);
        pumpToClients(clients, file);
      }
    }, path, names);

    return function (req, resp) {
      var cid = req.socket.remoteAddress + req.url,
        client,
        now = (new Date()).valueOf(),
        elapsed;

      if (client = clients[cid]) {
        // why would a client request before 
        client.end(); 
        //elapsed = now - client.timestamp;
        //return;
      }

      client = clients[cid] = {};

      client.req = req;
      client.resp = resp;
      client.timestamp = (new Date()).valueOf();
    };
  }

  module.exports = {
    respondOnFileUpdate: respondOnFileUpdate,
    pumpToClients: pumpToClients
  };

}());
