/*jshint node:true es5:true strict:true laxcomma:true laxbreak:true*/
(function () {
  "use strict";

  var fs = require('fs')
    , util = require('util')
    ;

  fs.copy = require('./fs.copy.js');
  fs.copyRecursive = require('./fs.copy-recursive.js');

  fs.move = require('./fs.move.js');

  fs.mkdirp = require('mkdirp');
  fs.mkdirpSync = fs.mkdirp.sync;
  // Alias
  fs.mkdirRecursive = fs.mkdirp;
  fs.mkdirRecursiveSync = fs.mkdirp.sync;

  fs.rmrf = require('fs-extra').rmrf;
  fs.rmrfSync = require('fs-extra').rmrfSync;
  // Alias
  fs.rmRecursive = require('fs-extra').rmrf;
  fs.rmRecursiveSync = require('fs-extra').rmrfSync;

  fs.walk = require('walk').walk;

  module.exports = fs;
}());
