#!/usr/bin/env node
(function () {
  "use strict";

  require('./buffer-add-chunk');

  var buffer = new Buffer(16), remnant, result;

  buffer.addChunk(new Buffer("abcde"));
  buffer.addChunk(new Buffer("fghij"));
  buffer.addChunk(new Buffer("klmno"));
  remnant = buffer.addChunk(new Buffer("pqrst"));

  if ("abcdefghijklmnop" !== buffer.toString()) {
    console.log("expected the letters a-p, but saw: ", buffer.toString());
  } else {
    console.log("pass: ", 'buffer becomes full');
  }

  if ("qrst" !== remnant.toString()) {
    console.log("expected the letters 'qrst', but saw: ", remnant.toString());
  } else {
    console.log("pass: ", 'remnant catches overflow');
  }

  result = buffer.addChunk(new Buffer("uvwxyz"));
  if (false !== result) {
    console.log("expected 'false', but saw: ", result);
  } else {
    console.log("pass: ", 'adding fails when full');
  }
}());
