(function () {
  "use strict";

  Object.prototype.getElementByPath = function (str) {
    var i, obj = this, path = str.split('.');
    for (i = 0; i < path.length; i += 1) {
      obj = obj[path[i]];
      if ('undefined' === typeof obj) {
        return;
      }
    }
    return obj;
  };
}());

var obj = {
  a: {
    b: {
      c: {
        d: "hello world"
      }
    }
  }
};

function testShort() {
  if (!obj.getElementByPath("a.b.c")) {
    console.log("FAIL: short");
  } else {
    console.log("pass: found a.b.c");
  }
}

function testExact() {
  if (!obj.getElementByPath("a.b.c.d")) {
    console.log("FAIL: exact");
  }
}

function testLong() {
  if (obj.getElementByPath("a.b.c.d.e")) {
    console.log("FAIL: long");
  }
}

function testWrong() {
  if (obj.getElementByPath("b.c.d")) {
    console.log("FAIL: wrong");
  }
}

testShort();
testExact();
testLong();
testWrong();
