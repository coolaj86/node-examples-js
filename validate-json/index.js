#!/usr/bin/env node
(function () {
  "use strict";

  var fs = require('fs')
    , filename = process.argv[2];

  try {
    JSON.parse(fs.readFileSync(filename));
  } catch(e) {
    console.error("[ERROR]");
    throw e;
  }
  console.log("[PASS] '" + filename + "' contains valid JSON");
}());
