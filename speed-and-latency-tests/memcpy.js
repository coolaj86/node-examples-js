#!/usr/bin/env node

// Just trying to determine if how much transfer is slowed
// by multiple calls to C++

(function () {
  "use strict";

  var time,
    i,
    num = process.argv[2] || 1,
    size = num * 1024 * 1024,
    b1 = new Buffer(size),
    b2 = new Buffer(size),
    b3 = new Buffer(size / 8);

  time = (new Date()).valueOf();
  b1.copy(b2, 0, 0);
  console.log(num + "mb transfer + initialization overhead", (new Date()).valueOf() - time, "ms");

  time = (new Date()).valueOf();
  b1.copy(b2, 0, 0);
  console.log(num + "mb transfer in", (new Date()).valueOf() - time, "ms");

  time = (new Date()).valueOf();
  for (i = 0; i < 8; i += 1) {
    b3.copy(b1, b3.length * i, 0);
  }
  console.log(num + "mb transfer in 8 chunks in ", (new Date()).valueOf() - time, "ms");
}());
