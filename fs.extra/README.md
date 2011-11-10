fs.extra
===

Adds `fs.move` and `fs.copy` to Node.JS' `fs`.

    var fs = require('fs.extra');

fs.copy
===

Creates an `fs.readStream` and `fs.writeStream` and uses `util.pump` to efficiently copy.

    fs.copy('foo.txt', 'bar.txt', function (err) {
      if (err) {
        throw err;
      }

      console.log("Copied 'foo.txt' to 'bar.txt');
    });

fs.move
===

Attempts `fs.rename`, then tries `fs.copy`/`fs.unlink` before failing.

    fs.move('foo.txt', 'bar.txt', function (err) {
      if (err) {
        throw err;
      }

      console.log("Moved 'foo.txt' to 'bar.txt');
    });
