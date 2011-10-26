#!/usr/bin/env node
(function () {
  "use strict";

  var served = require('served')
    , port = process.argv[2] || 3000
    ;

  served.listen(port, function () {
    console.log('Serving HTTP on 0.0.0.0 port', port);
  });
}());
