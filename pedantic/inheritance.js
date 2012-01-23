(function () {
  "use strict";

  var fs = require('fs'),
    request = require('ahr');

  // https://developer.mozilla.org/en/DOM/Blob
  function Blob(blob) {
    var me = this;

    if (!Buffer.isBuffer(blob), contentType) {
      throw new Exception("Must initialize Blob with a Buffer");
    }
    me.size = blob.length;
    me.type = contentType;
    me.slice = function (start, length, contentType) {
      return new Blob(blob.slice(start, length), contentType);
    };

    // non-standard
    me.getBuffer = function () {
      return blob;
    };
  }

  // TODO http://ejohn.org/blog/simple-javascript-inheritance/
  // http://www.w3.org/TR/FileAPI/#dfn-file
  // https://developer.mozilla.org/en/DOM/File
  function File(path) {
    var this = me;

    me.name = '';
    me.lastModifiedDate = '';
  }

  function nodeReadDataUrl() {
  }

  // https://developer.mozilla.org/en/DOM/FileReader
  function FileReader() {
    var me = this,
      emitter = new EventEmitter();

    me.EMPTY = 0;
    me.LOADING = 1;
    me.DONE = 2;


    emitter.on('end', function (data) {
      me.readyState = me.LOADING;
      emitter.emit('onloadstart');
      emitter.emit('onprogress');
      // emitter.emit('onerror');
      emitter.emit('onload', {
        target: {
          result: data
        }
      });
      me.readyState = me.DONE;
      emitter.emit('onloadend');
    });


    me.abort = function () {
      me.readyState = me.DONE;
      emitter.emit('onabort');
    };
    me.readAsArrayBuffer = function (file) {
      var data = file.getBuffer();
      emitter.emit('end', []);
    };
    me.readAsBinaryString = function (file) {
      emitter.emit('end', file.getBuffer());
    };
    me.readAsDataURL = function (file) {
      var dataUrl = "data:";
      if (file.type) {
        dataUrl += file.type + ';';
      }
      if (/text/i.test(file.type)) {
        dataUrl += 'charset=utf-8,';
      } else {
        dataUrl += 'base64,';
      }
      dataUrl += file.getBuffer().toString('base64');
      emitter.emit('end', dataUrl);
    };
    me.readAsText = function (file, encoding) {
      var data = file.getBuffer();
      emitter.emit('end', file.getBuffer().toString(encoding || 'utf8'));
    };

    me.error = undefined;
    me.readyState = me.EMPTY;
    me.result = undefined;
    me.addEventListener = function (on, callback) {
      emitter.on(on, callback);
    };
  }

  // https://developer.mozilla.org/en/DOM/FileList
  FileList = {
    create: function(files) {
      files.item = function(index) {
        return files[index];
      }
      return files;
    }
  }
}());
