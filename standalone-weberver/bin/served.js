#!/usr/bin/env node
(function () {
  "use strict";

  var served = require('served')
    , port = process.argv[2] || 3000
    ;

  served.listen(port, function () {
    console.log(
        'Serving '
      + served.path
      + ' via HTTP on '
      + served.address().address
      + ':'
      + served.address().port
    );
  });
}());
