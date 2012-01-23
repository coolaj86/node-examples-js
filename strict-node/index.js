// check the file for strict mode, then pass to node
(function () {
"use strict";

  
  // Note: All options passed to node/v8 before the module
  // to be run are excluded from argv

  // node --prof_lazy --foo index.js --bar thing --baz
  // argv: node, /path/to/index.js, --bar, thing, --baz

  // if any -- options are given before the filename, then another
  // instance of node should be created and exec`d
  console.log(process.argv);
}());
