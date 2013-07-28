/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  // TODO receive files
  var connect = require('connect')
    , util = require('util')
    , mkdirp = require('mkdirp')
    , fs = require('fs')
    , url = require('url')
    , path = require('path')
    , app
    , version = JSON.parse(fs.readFileSync(path.join(__dirname, '/../package.json'), 'utf8')).version
    ;

  function createFileReceiver(rootname) {
    return function receiveFile(req, res, next) {
      var pathname = path.normalize('/' + url.parse(req.url).pathname)
        , filename = pathname.replace(/.*\//, '')
        , dirpath
        , ws
        , err
        ;

      dirpath = pathname.split('/');
      dirpath.pop();  // trailing filename
      dirpath.shift(); // leading nothing
      dirpath = dirpath.join('/');

      if (!/POST|PUT/i.test(req.method)) {
        next();
        return;
      }

      if (/multipart|json|urlencoded/i.test(req.headers['content-type'])) {
        next();
        return;
      }

      try {
        mkdirp.sync(path.join(rootname, dirpath));
      } catch(e) {
        dirpath = '.';
      }

      filename = path.join(rootname, dirpath, (filename || 'served-stream.bin'));

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

  function createStaticServer(rootname) {
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
          console.error("required '" + rootname  + "', but couldn't use it as a connect module");
          console.error(e);
          failed = true;
        }
        next();
      }
    }

    app = connect();

    try {
      somereq = require(rootname);

      if ('function' === typeof somereq) {
        app.use(useUserReq);
      } else {
        app.use(somereq);
      }

      console.log(rootname, "is a loadable module. I'm gonna load it!");
    } catch(e) {
      console.log(rootname, "is not a loadable module and that's okay.");
      // ignore
    }

    app
      .use(connect.static(rootname))
      .use(connect.directory(rootname))
      .use(createFileReceiver(rootname))
      .use('/version', function (req, res, next) {
          res.end(version);
        })
      .use(connect.json())
      .use(connect.urlencoded())
      .use(connect.multipart())
      .use(function (req, res) {
          console.log(req.body);
          res.end();
        })
      ;

    return app;
  }

  module.exports = createStaticServer;
  module.exports.create = createStaticServer;
}());
