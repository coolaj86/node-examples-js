(function () {
  "use strict";

  var settings = require("./settings-saver-example");
  settings.read(function (err, data, level, level2) {
    console.log(err);
    console.log(data);
    console.log(level);
    console.log(level2);
  });
}());
