(function () {
  "use strict";

  var stdin = process.openStdin()
    , key = process.argv[2].split('.')
    , json = ''
    ;

  stdin.on('data', function (chunk) {
    json += chunk;
  });

  stdin.on('end', function () {
    var data = JSON.parse(json)
      ;

    key.some(function (k) {
      data = data[k];
      if (undefined === data || null === data) {
        return true;
      }
    });

    console.log(JSON.stringify(data));
  });
}());
