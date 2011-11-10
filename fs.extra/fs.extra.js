(function () {
  "use strict";

  var fs = require('fs')
    , util = require('util')
    ;

  fs.copy = function (src, dst, cb) {
    function copy(err) {
      var is
        , os
        ;

      if (!err) {
        return cb(new Error("File " + dst + " exists."));
      }

      fs.stat(src, function (err) {
        if (err) {
          return cb(err);
        }
        is = fs.createReadStream(src);
        os = fs.createWriteStream(dst);
        util.pump(is, os, cb);
      });
    }

    fs.stat(dst, copy);
  };

  fs.move = function (src, dst, cb) {
    function copyIfFailed(err) {
      if (!err) {
        return cb(null);
      }
      fs.copy(src, dst, function(err) {
        if (!err) {
          // TODO 
          // should we revert the copy if the unlink fails?
          fs.unlink(src, cb);
        } else {
          cb(err);
        }
      });
    }

    fs.stat(dst, function (err) {
      if (!err) {
        return cb(new Error("File " + dst + " exists."));
      }
      fs.rename(src, dst, copyIfFailed);
    });
  };

  module.exports = fs;
}());
