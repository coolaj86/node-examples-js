(function () {
  "use strict";

  var connect = require('connect')
    , pathname = process.cwd()
    , fs = require('fs')
    , path = require('path')
    , app
    , version = JSON.parse(fs.readFileSync(path.join(__dirname, '/../package.json'), 'utf8')).version
    ;

  app = connect()
    .use(connect.static(pathname))
    .use(connect.directory(pathname))
    .use('/version', function (req, res, next) {
      res.end(version);
    })
    ;

  module.exports = app;
  module.exports.path = pathname;
}());
