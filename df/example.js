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
