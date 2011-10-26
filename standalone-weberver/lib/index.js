(function () {
  "use strict";

  var connect = require('connect')
    , path = process.cwd()
    , server
    ;

  server = connect.createServer(
      connect.static(path)
    , connect.directory(path)
  );

  module.exports = server;
}());
