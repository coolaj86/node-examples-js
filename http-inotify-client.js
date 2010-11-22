(function (undefined) {
  // npm install ahr
  var request = require('ahr'),
    getter,
    handler;

  getter = function () {
    request.get("http://localhost:3000/file.txt").when(handler);
  }

  // TODO add oneshot:true to AbstractHttpRequest
  handler = function (err, ahr, data) {
    console.log(data);
    getter();
  };

  getter();
}());
