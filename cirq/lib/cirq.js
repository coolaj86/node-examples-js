(function () {
  "use strict";

  // wtfjs x == x+1
  var MAX_INT = 4294967295; // Math.pow(2, 32) - 1;

  function CirQ(maxlen) {
    if (!maxlen) {
      maxlen = MAX_INT;
    }
    this.maxlen = maxlen;
    this.cirq = {};
    this.oldest = 0;
    this.next = 0;
    this.length = 0;
  }

  // wrapping addition
  function wadd(i, max) {
    return (i + 1) % max;
  }

  CirQ.prototype.push = function (item) {
    if (this.next === this.oldest && this.length) {
      this.oldest = wadd(this.oldest, this.maxlen);
    }
    this.cirq[this.next] = item;
    this.length = Math.min(this.length + 1, this.maxlen);
    this.next = wadd(this.next, this.maxlen);
    //console.log('<<', this.oldest, this.next, this.cirq);
  };

  CirQ.prototype.pop = function () {
    var res = this.cirq[this.oldest];
    delete this.cirq[this.oldest];

    // stuck at head, can't go further
    if (this.length) {
      this.oldest = wadd(this.oldest, this.maxlen);
    }
    this.length = Math.max(this.length - 1, 0);

    //console.log('^^', this.oldest, this.next, this.cirq);
    return res;
  };

  CirQ.prototype.toArray = function () {
    var res = []
      , i = this.oldest
      ;

    while (res.length !== this.length) {
      res.push(this.cirq[i]);
      i = wadd(i, this.maxlen);
    }

    return res;
  };

  module.exports = CirQ;
}());
