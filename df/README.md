df
===

Wraps `df -B 512` (Linux and Cygwin) or `df -b` (OS X) and produces pretty output.

Gives output for both real and virtual filesystems.

Installation
===

To install both module and commandline versions:

    npm install df
    npm install -g df

Usage
===

Command-line:

    df-json

Module:

    (function () {
      "use strict";

      var df = require('df')
        ;

      df(function (err, table) {
        if (err) {
          console.error(err.stack);
          return;
        }

        console.log(JSON.stringify(table, null, '  '));
      });
    }());

Output:
===

    [
      {
        "filesystem": "/dev/disk0s2",
        "blocks": 488555536,
        "used": 472631632,
        "available": 15411904,
        "percent": 97,
        "mountpoint": "/"
      }
    ]
