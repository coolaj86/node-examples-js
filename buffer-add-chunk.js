(function () {
  "use strict";

  Buffer.prototype.addChunk = (function () {
    var remnant,
      index = 0;

    return function (chunk) {
      if (index === this.length) {
        return false;
      }

      var len = Math.min(chunk.length, this.length - index);

      chunk.copy(this, index, 0, len);
      index += len;

      if (len < chunk.length) {
        //remnant = new Buffer(chunk.length - len);
        //chunk.copy(remnant, 0, len, chunk.length);
        remnant = chunk.slice(len, chunk.length);
        return remnant;
      }
    }
  }());
}());
