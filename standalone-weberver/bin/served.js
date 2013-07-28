#!/usr/bin/env node
/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  var createStaticServer = require('../lib').create
    , port = process.argv[2] || 3000
    , path = require('path')
    , pathname = path.resolve(process.cwd(), (process.argv[3] || ''))
    , server
    ;

  server = createStaticServer(pathname).listen(port, function () {
    console.log(
        'Serving '
      + pathname
      + ' via HTTP on '
      + server.address().address
      + ':'
      + server.address().port
    );
  });
}());
