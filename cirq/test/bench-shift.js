(function () {
  "use strict";

  function benchShift(max, postMax) {
    console.log(max, postMax);

    var arr = []
      , now
      , i
      ;

    now = new Date().valueOf()
    for (i = 0; i < max; i += 1) {
      arr.push('xyz');
    }
    console.log(new Date().valueOf() - now);

    now = new Date().valueOf();
    for (i = 0; i < postMax; i += 1) {
      arr.shift();
      arr.push('abc');
    }
    console.log(new Date().valueOf() - now);

    console.log();
  }

  // warm-up run
  benchShift(5000, 1000);

  benchShift(5000, 1000);
  // 0 ~ 1 ms
  // 0 ~ 1 ms

  benchShift(50000, 10000);
  // 10 ~ 13 ms
  // 0 ~ 2 ms

  benchShift(500000, 1000);
  // ~ 60 ms
  // ~ 1200 ms

  benchShift(5000000, 1);

}());
