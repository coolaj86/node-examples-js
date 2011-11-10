// Adapted from http://dean.edwards.name/weblog/2006/11/hooray/

// Note: This examples works in browsers and SSJS. It won't work in MSIE.
(function () {
  "use strict";

  // create the constructor
  function FileList(args) {
    var i;

    if (!(args instanceof Array)) {
      args = Array.prototype.slice.call(arguments);
    }

    // forEach won't work because `this` loses its scope
    for (i = 0; i < args.length; i += 1) {
      this.push(args[i]);
    }

    // prevent user extension
    this.push = undefined;
    this.pop = undefined;
  };

  // inherit from Array
  FileList.prototype = new Array;

  // add some sugar
  FileList.prototype.item = function(index) {
    return this[index];
  };

  // For some reason this won't stringify correctly
  // as a subtype of Array
  FileList.prototype.toJSON = function () {
    return this.slice();
  };

  FileList.prototype.toString = function () {
    return JSON.stringify(this.join(','));
  };

  module.exports = FileList;
}());


// Test functionality of the above
(function () {
  "use strict";

  var FileList = module.exports
    , fileList
    ;

  // First of all: JavaScript doesn't have arrays. Really!
  // http://javascript.about.com/od/problemsolving/a/notarrays.htm

  // NOTE: .length will only be correct if .push is used
  // not if [i] notation is used
  /*
  var fileList = new FileList();
  fileList.push('a');
  fileList.push('b');
  fileList.push('c');
  */

  fileList = new FileList(['a','b',3]);
  console.error('[FAIL]', 'Array.isArray(fileList):', Array.isArray(fileList));

  console.log(fileList.item(0));
  console.log(fileList[1]);

  fileList = new FileList('a','b',3);
  console.log(fileList.item(2));

  // Love the brokenness
  console.log(JSON.stringify(['a', 'b', 3]));
  //console.log(fileList.toString());
  console.log([1, 2, 3].toString());
  console.log(JSON.stringify(fileList), typeof JSON.stringify(fileList));
  console.log(fileList.forEach)
}());
