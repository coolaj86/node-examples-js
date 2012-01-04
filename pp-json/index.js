#!/usr/bin/env node
(function () {
  "use strict";

  var fs = require('fs')
    , prettyPrint = require('./json2').stringify
    , filename = process.argv[2]
    , json
    ;

  function ppJson() {
    json = prettyPrint(json, null, '  ');
    console.log(json);
  }

  function readJsonFile() {
    try {
      json = JSON.parse(fs.readFileSync(filename));
    } catch(e) {
      console.error("[ERROR] couldn't parse JSON from '" + filename + "':");
      console.error(e.message);
    }

    ppJson();
  }

  function readJsonStdin() {
    var timeoutToken
      , stdin = process.openStdin()
      ;

    timeoutToken = setTimeout(function () {
      console.warn("Usage: pp-json /path/to/data.json");
      console.warn("Usage: echo '{ \"foo\": \"bar\" }' | pp-json");
      process.exit();
    }, 1000);

    json = '';

    stdin.on('data', function (chunk) {
      clearTimeout(timeoutToken);
      json += chunk;
    });
    
    stdin.on('end', function () {
      try {
        json = JSON.parse(json);
      } catch(e) {
        console.error("[ERROR] couldn't parse JSON from stdin:");
        console.error(e.message);
        return;
      }

      ppJson();
    });
  }

  if (filename) {
    readJsonFile();
  }
  else {
    readJsonStdin();
  }

}());
