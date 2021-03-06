#!/usr/bin/env node
(function () {
  "use strict";

  var fs = require('fs')
    , filename = process.argv[2]
    ;

  function printUsage() {
    console.warn("Usages:");
    console.warn("json-urlencode path/to/example.json");
    console.warn("cat path/to/example.json | json-urlencode");
    console.warn("curl http://foobar3000.com/echo/?urlEncodedJson=`json-urlencode path/to/example.json`");
  }

  function handleInput(err, text) {
    var uriEncoded
      , wrappedInHtml
      ;

    if (err) {
      printUsage();
      return;
    }

    // We make sure we remove any extra whitespace here
    uriEncoded = encodeURIComponent(JSON.stringify(JSON.parse(text)));

    console.info(uriEncoded);
  }

  readInput(handleInput, filename);

  //
  // this could (and probably should) be its own module
  //
  function readInput(cb, filename) {

    function readFile() {
      fs.readFile(filename, 'utf8', function (err, text) {
        if (err) {
          console.error("[ERROR] couldn't read from '" + filename + "':");
          console.error(err.message);
          return;
        }

        cb(err, text);
      });
    }

    function readStdin() {
      var text = ''
        , timeoutToken
        , stdin = process.stdin
        ;
      
      stdin.resume();

      // how to tell piping vs waiting for user input?
      timeoutToken = setTimeout(function () {
        cb(new Error('no stdin data'));
        stdin.pause();
      }, 1000);

      stdin.on('data', function (chunk) {
        clearTimeout(timeoutToken);
        text += chunk;
      });
      
      stdin.on('end', function () {
        cb(null, text);
      });
    }

    if (filename) {
      readFile();
    }
    else {
      readStdin();
    }

  }

}());
