(function () {
  "use strict";

  var x = 0
    , scale = 1
    , start = new Date().valueOf()
    ;

  while (x + 1 != x) {
    if (x >= scale) {
      console.log(x);
      scale *= 10;
    }
    x += 1
  }

  console.log(x, new Date().valueOf() - start);
}());
