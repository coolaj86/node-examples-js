#!/usr/bin/env node
(function (undefined) {
  "use strict";

  process.title = "capture-notify-gmti";
  process.on("uncaughtException", function (err) {
    console.log("uncaughtException");
    console.log(JSON.stringify(err));
  
    var fs = require("fs");
    fs.writeFile("/tmp/" + process.title + "-" + process.pid + ".log", JSON.stringify(err), function (err) {
        if (err) {
            console.log("could not log");
            console.log(JSON.stringify(err));
        }
        process.exit(-117);
    });
  });

  throw new Error("craptacular exception");
});
