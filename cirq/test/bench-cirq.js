(function () {
  "use strict";

  var CirQ = require(__dirname + '/../lib/cirq')
    ;

  function benchCirQ(max, postMax) {
    console.log(max, postMax);

    var now = new Date().valueOf()
      , cirq = new CirQ(max)
      , i
      ;
    
    for (i = 0; i < max; i += 1) {
      cirq.push('xyz');
    }
    console.log(new Date().valueOf() - now);
    now = new Date().valueOf();

    for (i = 0; i < postMax; i += 1) {
      cirq.push('abc');
    }
    console.log(new Date().valueOf() - now);

    console.log();
  }

  // warm-up
  benchCirQ(5000, 1000);

  benchCirQ(5000, 1000);
  // 1
  // 1

  benchCirQ(50000, 10000);
  // 20
  // 2

  benchCirQ(500000, 100000);
}());
