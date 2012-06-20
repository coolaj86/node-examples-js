/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  // TODO receive files
  var connect = require('connect')
    , pathname = process.cwd()
    , util = require('util')
    , fs = require('fs')
    , url = require('url')
    , path = require('path')
    , app
    , version = JSON.parse(fs.readFileSync(path.join(__dirname, '/../package.json'), 'utf8')).version
    ;

  app = connect()
    .use(connect.static(pathname))
    .use(connect.directory(pathname))
    .use(function (req, res, next) {
        var filename = url.parse(req.url).pathname.replace(/.*\//, '')
          , ws
          , err
          ;

        filename = filename || 'served-stream.bin';

        if (!/^POST$/i.exec(req.method)) {
          next();
        }

        util.print('Receiving ' + filename + ' ');

        try {
          // forgive me, for I have sinned
          fs.statSync(filename);
        } catch(e) {
          err = e;
        }

        if (!err) {
          console.log('hmm... that file exists, cancelling');
          res.end();
          return;
        }

        ws = fs.createWriteStream(filename);
        ws.on('error', function (err) {
          console.log('Had some problem... cancelling');
          console.error(err.message);
          res.end(err.message, 500);
        });
        req.on('data', function (chunk) {
          ws.write(chunk);
          util.print('.');
        });
        req.on('end', function () {
          ws.end();
          res.end();
          util.print(' done!');
          console.log();
        });
      })
    .use('/version', function (req, res, next) {
        res.end(version);
      })
    ;

  module.exports = app;
  module.exports.path = pathname;
}());
