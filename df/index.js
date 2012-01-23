#!/usr/bin/env node
(function () {
  "use strict";

  // map auto_home          0         0         0   100%    /home
  var exec = require('child_process').exec
    , os = require('os')
    , reCaptureCells = /^([^\s]+\s?[^\s]+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)%\s+(.*?)\s*$/
    , cmdMap = {
          "Darwin": "df -b"
        , "Linux": "df -B 512"
      }
    , reMap = {
          "Darwin": reCaptureCells
        , "Linux": reCaptureCells
      }
    , cmdDf = cmdMap[os.type()]
    , reDf = reMap[os.type()]
    ;

  function init() {
    // TODO test default block size
  }

  function df(cb) {
    function formatDf(err, stdout, stderr) {
      var table
        , infos = []
        ;

      function parseRow(row) {
        var cells = row.match(reDf)
          ;

        if (!cells) {
          return;
        }

        // FYI
        // It seems that RegExp Match isn't a true array
        // popping it deos weird things
        infos.push({
            filesystem: cells[1]
          , blocks: parseInt(cells[2], 10)
          , used: parseInt(cells[3], 10)
          , available: parseInt(cells[4], 10)
          , percent: parseInt(cells[5], 10)
          , mountpoint: cells[6]
        });
      }

      if (err) {
        cb(err);
        return;
      }

      if (stderr) {
        cb(new Error(stderr));
        return;
      }

      table = stdout.split(/\n/g);
      // get rid of header

      table.pop();
      table.forEach(parseRow);

      cb(null, infos);
    }

    exec('df', formatDf);
  }

  function main () {
    df(function (err, table) {
      if (err) {
        console.error(err.stack);
        return;
      }   

      console.log(JSON.stringify(table, null, '  '));
    })
  }

  if (require.main === module) {
      main();
  }

  module.exports = df;
}());
