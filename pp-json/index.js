#!/usr/bin/env node
(function () {
  "use strict";

  var fs = require('fs')
    , prettyPrint = require('./json2').stringify
    , filename = process.argv[2]
    , json
    ;

  try {
    json = JSON.parse(fs.readFileSync(filename));
  } catch(e) {
    console.error("[ERROR]");
    throw e;
  }

  json = prettyPrint(json, null, '  ');
  console.log(json);
}());
