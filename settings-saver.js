// Read and Write a settings file, with backup, and factory defaults

// Read from settings
//   -> fail -> readBackup
//      -> fail -> readDefaults
//         -> fail -> cb(err)
//         -> success -> writeSettings, writeBackup
//      -> success -> writeSettings, cb()
//   -> success -> cb()

// Write to settings
//   -> fail -> cb(err)
//   -> success -> writeBackup
//      -> fail -> cb(err)
//      -> success -> cb()

(function () {
  "use strict";

  var fs = require('fs');

  function create(o) {

    var normal = o.normal,
      backup = o.backup,
      factory = o.factory;

    function readFactory(cb) {
      fs.readFile(factory, function (err, json) {
        var data;
        try {
          data = JSON.parse(json);
        } catch(e) {
          err = e;
        }
    
        if (!err) {
          writeNormal(json, function (err, stage) {
            cb(err, data, 'factory', stage);
          });
        } else {
          cb(err, data, 'factory');
        }
      });
    }

    function readBackup(cb) {
      fs.readFile(backup, function (err, json) {
        var data;
        try {
          data = JSON.parse(json);
        } catch(e) {
          err = e;
        }

        if (err) {
          readFactory(cb);
        } else {
          writeNormal(json, function (err, stage) {
            cb(err, data, 'backup', stage);
          }, false);
        }

      });
    }

    function readNormal(cb) {
      fs.readFile(normal, function (err, json) {
        var data;
        try {
          data = JSON.parse(json);
        } catch(e) {
          err = e;
        }

        if (err) {
          readBackup(cb);
        } else {
          cb(err, data, 'normal');
        }
      });
    }

    function writeBackup(json, cb) {
      fs.writeFile(backup, json, function (err) {
        cb(err, 'backup');
      });
    }

    function writeNormal(json, cb, doBackup) {
      fs.writeFile(normal, json, function (err) {
        if (err) {
          return cb(err, 'normal');
        }

        if (false === doBackup) {
          cb(err, 'normal');
        } else {
          writeBackup(json, cb);
        }
      });
    }

    return {
      read: readNormal,
      write: function (settings, cb) {
        var json;
        try {
          json = JSON.stringify(settings);
        } catch(e) {
          return cb(e, 'parse');
        }

        writeNormal(json, cb);
      }
    };

  }

  module.exports = {
    create: create
  };
}());
