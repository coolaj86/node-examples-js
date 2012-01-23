(function () {
  "use strict";

  var pathname = ".";

  module.exports = require("./settings-saver").create({
    normal: pathname + "/settings.json",
    backup: pathname + "/settings.json.bak",
    factory: pathname + "/settings.json.factory"
  });

}());
