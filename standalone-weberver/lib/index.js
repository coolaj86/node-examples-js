/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  // TODO receive files
  var connect = require('connect')
    , util = require('util')
    , fs = require('fs')
    , url = require('url')
    , path = require('path')
    , app
    , version = JSON.parse(fs.readFileSync(path.join(__dirname, '/../package.json'), 'utf8')).version
    ;

  function createFileReceiver(pathname) {
    return function receiveFile(req, res, next) {
      var filename = url.parse(req.url).pathname.replace(/.*\//, '')
        , ws
        , err
        ;

      if (!/POST|PUT/i.test(req.method)) {
        next();
        return;
      }

      filename = path.join(pathname, (filename || 'served-stream.bin'));

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
    };
  }

  function createStaticServer(pathname) {
    var app
      , server
      , failed = false
      , somereq
      ;

   function useUserReq(req, res, next) {
      try {
        somereq(req, res, next);
      } catch(e) {
        if (!failed) {
          console.error("required '" + pathname  + "', but couldn't use it as a connect module");
          console.error(e);
          failed = true;
        }
        next();
      }
    }

    app = connect();

    try {
      somereq = require(pathname);

      if ('function' === typeof somereq) {
        app.use(useUserReq);
      } else {
        app.use(somereq);
      }

      console.log(pathname, "is a loadable module. I'm gonna load it!");
    } catch(e) {
      console.log(pathname, "is not a loadable module and that's okay.");
      // ignore
    }

    app
      .use(connect.static(pathname))
      .use(connect.directory(pathname))
      .use(createFileReceiver(pathname))
      .use('/version', function (req, res, next) {
          res.end(version);
        })
      ;

    return app;
  }

  module.exports = createStaticServer;
  module.exports.create = createStaticServer;
}());
