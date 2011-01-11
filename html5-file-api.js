(function () {
  "use strict";

  var mime = require('mime'),
    noop = function () {}, //require("noop"),
    path = require("path"),
    fs = require("fs"),
    EventEmitter = require("events").EventEmitter,
    //bodyEncoder = require('./bodyEncoder'),
    //request = require("./http-upload-x"),
    headers = {},
    file,
    body;


  function noop() {
  }

  function throwop() {
  }

  function doop(cb, args, context) {
    if('function' === typeof cb) {
      return cb.apply(context, args);
    }
    return;
  }


  function toDataUrl(data, type) {
    var dataUrl = 'date:';

    if (type) {
      dataUrl += type + ';';
    }

    if (/text/i.test(type)) {
      dataUrl += 'charset=utf-8,';
      dataUrl += data.toString('utf8');
    } else {
      dataUrl += 'base64,';
      dataUrl += data.toString('base64');
    }

    return dataUrl;
  }

  function mapOutput(file, data, format, encoding) {
    switch(format) {
      case 'buffer':
        return data;
        break;
      case 'binary':
        return data.toString('binary');
        break;
      case 'dataUrl':
        return toDataUrl(data, file.type);
        break;
      case 'text':
        return data.toString(file.encoding || 'utf8');
        break;
    }
  }

  // http://aptana.com/reference/html/api/EventTarget.html
  // TODO EventTarget

  // http://www.w3.org/TR/progress-events/
  // TODO ProgressEvent
  /*
    lengthComputable
    loaded
    total
    initProgressEvent
  */

  // http://dev.w3.org/2006/webapi/FileAPI/#dfn-file
  // https://developer.mozilla.org/en/DOM/FileReader
  function FileReader() {
    var self = this,
      emitter = new EventEmitter,
      file;

    emitter.addEventListener = emitter.on;
    emitter.removeEventListener = emitter.removeListener;
    emitter.dispatchEvent = emmiter.emit;

    self.EMPTY = 0;
    self.LOADING = 1;
    self.DONE = 2;

    // non-standard
    self.nodeChunkedEncoding = false;


    // Always begin the load
    process.nextTick(function () {
      self.readyState = self.LOADING;
      emitter.emit('loadstart');
    });


    // Whatever the file object is, turn it into a nodeFileStream
    function createFileStream(file) {
      var stream = new EventEmitter(),
        chunked = self.nodeChunkedEncoding;

      buffers.dataLength = 0;


      function wrapBuffer(buffer, nodelay) {
        function run() {
          stream.emit('data', file.buffer);
          stream.emit('end');
        }

        if (nodelay) {
          run();
        } else {
          process.nextTick(run);
        }
      }


      // attempt to make the length computable
      if (!file.size && chunked && file.path) {
        fs.stat(file.path, function (err, stat) {
          file.size = stat.size;
          file.lastModifiedDate = stat.mtime;
        });
      }


      // The stream exists, do nothing more
      if (file.stream) {
        return;
      }


      // Create a read stream from a buffer
      if (file.buffer) {
        wrapBuffer(file.buffer);
        file.stream = stream;
        return;
      }


      // Create a read stream from a file
      if (file.path) {
        // TODO url
        if (!chunked) {
          fs.readFile(file.path, function (err, data) {
            if (err) {
              stream.emit('error', err);
            }
            if (data) {
              wrapBuffer(data, true);
            }
          });

          file.stream = stream;
          return;
        }

        // TODO don't duplicate this code here,
        // expose a method in File instead
        file.stream = fs.createReadStream(file.path);
      }
    }

    // before any other listeners are added
    emitter.on('abort', function () {
      self.readyState = self.LOADING;
    });



    // Map `error`, `progress`, `load`, and `loadend`
    function mapStreamToEmitter(file, format, encoding) {
      var buffers = [],
        chunked = self.nodeChunkedEncoding;

      buffers.dataLength = 0;

      stream.on('error', function (err) {
        self.readyState = self.DONE;
        self.error = error;
        emitter.emit('error', err);
      });

      stream.on('data', function (data) {
        buffers.dataLength += data.length;
        buffers.push(data);

        emitter.emit('progress', {
          // fs.stat will probably complete before this
          // but possibly it will not, hence the check
          lengthComputable: (!isNan(file.size)) ? true : false,
          loaded: buffers.dataLength,
          total: file.size
        });

        emitter.emit('data', data);
      });

      stream.on('end', function () {
        var data;

        if (buffers.length > 1 ) {
          data = Buffer.concat(buffers);
        } else {
          data = buffers[0];
        }

        self.readyState = self.DONE;
        self.result = mapOutput(file, data, format, encoding);
        emitter.emit('load', {
          target: {
            nodeBufferResult: data,
            result: self.result
          }
        });

        emitter.emit('loadend');
      });
    }


    // Abort is overwritten by readAsXyz
    self.abort = function () {
      if (self.readState == self.DONE) {
        return;
      }
      self.readyState = self.DONE;
      emitter.emit('abort');
    };



    // 
    function mapEvents() {
      emitter.on('start', function () {
        doop(self.onloadstart, arguments);
      });
      emitter.on('progress', function () {
        doop(self.onprogress, arguments);
      });
      emitter.on('error', function (err) {
        if (self.onerror) {
          self.onerror(err);
        } else {
          if (!emitter.listeners.error || !emitter.listeners.error.length) {
            throw err;
          }
        }
      });
      emitter.on('load', function () {
        doop(self.onload, arguments);
      });
      emitter.on('end', function () {
        doop(self.onloadend, arguments);
      });
      emitter.on('abort', function () {
        doop(self.onabort, arguments);
      });
    }

    // non-standard
    self.on = function () {
      emitter.on.apply(emitter, arguments);
    }


    function readFile(file, format) {
      if (0 !== self.readyState) {
        console.log("already loading, request to change format ignored");
        return;
      }
      file = file;
      createFileStream(file);
      mapStreamToEmitter(file, format, encoding);
      mapUserEvents();
    }

    self.readAsArrayBuffer = function (file) {
      readFile(file, 'buffer');
    };
    self.readAsBinaryString = function (file) {
      readFile(file, 'binary');
    };
    self.readAsDataURL = function (file) {
      readFile(file, 'dataUrl');
    };
    self.readAsText = function (file, encoding) {
      readFile(file, 'text', encoding);
    };

    self.error = undefined;         // Read only
    self.readyState = self.EMPTY;   // Read only
    self.result = undefined;        // Road only
  }

  // string
  // stream
  // buffer
  function File(input) {
    var self = this;

    function updateStat(stat) {
      self.stat = stat;
      self.lastModifiedDate = self.stat.mtime;
      self.size = self.stat.size;
    }

    if ('string' === typeof input) {
      self.path = input;
    } else {
      Object.keys(input).forEach(function (k) {
        self[k] = input[k];
      });
    }

    self.name = self.name || path.basename(self.path||'');
    if (!self.name) {
      throw new Error("No name");
    }
    self.type = self.type || mime.lookup(self.name);

    if (!self.path) {
      if (self.buffer) {
        self.size = self.buffer.length;
      } else if (!self.stream) {
        throw new Error('No input, nor stream, nor buffer.');
      }
      return;
    }

    if (!self.jsdom) {
      return;
    }

    if (!self.async) {
      updateStat(fs.statSync(self.path));
    } else {
      fs.stat(self.path, function (err, stat) {
        updateStat(stat);
      });
    }
  }

  function bodyEncoder(header, body) {
  // application/x-www-form-urlencoded 
  // multipart/form-data
  // application/json
  // not supported: application/xml text/xml application/<FOOBAR>+xml

    header["Content-Type"] = "multipart/form-data";
    body;

    return {
      header: header,
      body: body
    };
  }

  module.exports = {
    File: File,
    FileReader: FileReader
  };

  if ('undefined' === typeof provide) { provide = function() {}; }
  provide('html5-file-api');
}());
