#!/usr/bin/env node
(function () {
  "use strict";

  require('./buffer-add-chunk');

  var buffer, remnant, result;

  function initBuffer() {
    buffer = new Buffer(16);

    buffer.addChunk(new Buffer("abcde"));
    buffer.addChunk(new Buffer("fghij"));
  }

  function testExactSize() {
    initBuffer();

    remnant = buffer.addChunk(new Buffer("klmnop"));

    if ("abcdefghijklmnop" !== buffer.toString()) {
      console.log("FAIL: expected the letters a-p, but saw: ", buffer.toString());
    } else {
      console.log("pass: ", 'buffer becomes full');
    }

    if ("true" !== remnant.toString()) {
      console.log("FAIL: expected true, indicating exact amount of data, but saw: ", remnant.toString());
    } else {
      console.log("pass: ", 'exact amount, no overflow');
    }

    /*
    try {
      result = buffer.addChunk(new Buffer("uvwxyz"));
      console.log("expected 'false', but saw: ", result);
    } catch(e) {
      console.log("pass: ", 'adding fails when full');
    }
    */

    result = buffer.addChunk(new Buffer("uvwxyz"));
    if (false !== result) {
      console.log("FAIL: expected 'false', but saw: ", result);
    } else {
      console.log("pass: ", 'adding fails when full');
    }
  }

  function testTooBig() {
    initBuffer();

    remnant = buffer.addChunk(new Buffer("klmno"));
    remnant = buffer.addChunk(new Buffer("pqrst"));

    if ("qrst" !== remnant.toString()) {
      console.log("FAIL: expected the letters 'qrst', but saw:", remnant.toString());
    } else {
      console.log("pass: ", 'remnant catches overflow');
    }
  }

  testExactSize();
  testTooBig();
}());
