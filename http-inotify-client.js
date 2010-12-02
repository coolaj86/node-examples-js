(function (undefined) {
  // npm install ahr
  var request = require('ahr'),
    getter,
    handler,
    timestamp = (new Date()).valueOf();

  getter = function () {
    request.get("http://localhost:3000/file.txt").when(handler);
  }

  // TODO add oneshot:true to AbstractHttpRequest
  handler = function (err, ahr, data) {
    if (err) {
      console.log(err);
      return;
    }
    var now = (new Date()).valueOf();
    console.log("response in " + (now - timestamp) / 1000.0 + "s");
    timestamp = now;
    getter();
  };

  getter();
}());
