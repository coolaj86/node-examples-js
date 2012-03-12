#!/usr/bin/env node
(function () {
  "use strict";

  var served = require('../lib')
    , port = process.argv[2] || 3000
    , server
    ;

  server = served.listen(port, function () {
    console.log(
        'Serving '
      + served.path
      + ' via HTTP on '
      + server.address().address
      + ':'
      + server.address().port
    );
  });
}());
