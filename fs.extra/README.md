fs.extra
===

Adds `copy`, `copyRecursive`, `mkdirp`, `move`, `walk`, and `rmrf` to Node.JS' `fs`.

Install with `npm install -S fs.extra`

    // this will have all of the normal fs methods
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

fs.copyRecursive
===

Basically a local `rsync`, uses `fs.copy` to recursively copy files and folders (with correct permissions).

    fs.copyRecursive('./foo', './bar', function (err) {
      if (err) {
        throw err;
      }

      console.log("Copied './foo' to './bar');
    });

fs.mkdirp
===

Included from <https://github.com/substack/node-mkdirp>

    // fs.mkdirp(path, mode=(0777 & (~process.umask())), cb);

    fs.mkdirp('/tmp/foo/bar/baz', function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log('pow!')
      }
    });

fs.mkdirpSync
===

Included from <https://github.com/substack/node-mkdirp>

    // fs.mkdirpSync(path, mode=(0777 & (~process.umask())));

    try {
      fs.mkdirpSync('/tmp/foo/bar/baz');
    } catch(e) {
      throw e;
    }

fs.move
===

Attempts `fs.rename`, then tries `fs.copy` + `fs.unlink` before failing.

    fs.move('foo.txt', 'bar.txt', function (err) {
      if (err) {
        throw err;
      }

      console.log("Moved 'foo.txt' to 'bar.txt');
    });

fs.rmrf
===

Included from <https://github.com/jprichardson/node-fs-extra>

Recursively deletes a directory (like `rm -rf`)

    // fs.rmrf(dir, callback);

    fs.rmrf('/choose/me/carefully/', function (err) {
      if (err) {
        console.error(err);
      }
    });

fs.rmrfSync
===

Included from <https://github.com/jprichardson/node-fs-extra>

Recursively deletes a directory (like `rm -rf`)

    // fs.rmrfSync(dir);

    fs.rmrfSync('/choose/me/carefully/');

fs.walk
===

See <https://github.com/coolaj86/node-walk>

    var walker = fs.walk(dir)
      ;

    // file, files, directory, directories
    walker.on("file", function (root, stat, next) {
      var filepath = path.join(root, stat.name)
        ;

      console.log(filepath);
    });

Aliases
===

For the sake of consistency you can call the recursive functions with their names as such

    fs.rmRecursive <- fs.rmrf
    fs.rmRecursiveSync <- fs.rmrfSync
    fs.mkdirRecursive <- fs.mkdirp
    fs.mkdirRecursiveSync <- fs.mkdirpSync
