"use strict";
var myClass = {};
(function () {
  var msg = "Hello World!";
  myClass.say = function () {
    console.log(msg);
  };
  myClass.think = function (what) {
    msg = what;
  };
}());


myClass.say();
myClass.think("I love yellow.");
msg = "Hello Again.";
myClass.say();




"use strict";
var myClass = {};
(function () {
  var msg = "Hello World!";

  myClass.say = function () {
    setTimeout(function () {
      console.log(msg);
    }, 2000);
  };

  myClass.think = function (what) {
    msg = what;
  };
}());

myClass.say();
myClass.think("B-A-N-A-N-A-S!");






"use strict";
var myClass = {};
(function () {
  var msg = "Hello World!";

  myClass.say = function () {
    var myMsg = msg;
    setTimeout(function () {
      console.log(myMsg);
    }, 2000);
  };

  myClass.think = function (what) {
    msg = what;
  };
}());

setTimeout(function () {
  myClass.think("Housetop");
  myClass.say();
}, 2000);

myClass.say();
myClass.think("B-A-N-A-N-A-S!");
myClass.say();

setTimeout(function () {
  myClass.think("Treetop");
  myClass.say();
}, 1000);
