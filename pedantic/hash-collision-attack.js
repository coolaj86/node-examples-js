(function () {
  "use strict";

  var size
    , startTime
    , endTime
    , array
    , key
    , maxKey
    ;
  
  size = Math.pow(2, 22); // 16 is just an example, could also be 15 or 17

  startTime = Date.now();

  array = [];
  key = 0;
  maxKey = (size - 1) * size;
  for (; key <= maxKey; key += size) {
    array[key] = 0;
  }

  endTime = Date.now();

  console.log('Inserting ', size, ' evil elements took ', endTime - startTime, ' ms', "\n");

  startTime = Date.now();

  array = [];
  key = 0;
  maxKey = size - 1;
  for (; key <= maxKey; ++key) {
      array[key] = 0;
  }

  endTime = Date.now();

  console.log('Inserting ', size, ' good elements took ', endTime - startTime, ' ms', "\n");
}());
