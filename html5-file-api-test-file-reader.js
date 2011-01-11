(function () {
  "use strict";

  var assert = require('assert'),
    sequence = require('futures/sequence')(),
    fs = require('fs'),
    File = require('./html5-file-api').File,
    FileReader = require('./html5-file-api').FileReader,
    fileData = {
      path: './files/coolaj86-2010.jpg',
      name: 'coolaj86-2010.jpg',
      type: 'image/jpeg'
    },
    fileStat = fs.statSync(fileData.path),
    lastModifiedDate = fileStat.mtime.toISOString(),
    fileBuffer = fs.readFileSync(fileData.path),
    fileBase64 = fileBuffer.toString('base64'),
    fileDataUrl = "data:image/jpeg;base64,",
    file,
    chunkedEncoding = (new Date().valueOf() % 2) ? true : false;



  sequence

    //
    // Test DataURL conversion with different file load methods
    //

    // Give Path
    // Give both onload and addEventListener
    .then(function (next) {
      var fileReader = new FileReader(),
        onloaded,
        size = 0,
        count = 0;


      // non-standard, node-only `data`
      fileReader.addEventListener('data', function (data) {
        count += 1;
        size += data.length;
        //console.log("no-chunk:", data.length);
      });


      // TODO Futures.join
      fileReader.addEventListener('load', function (ev) {
        onloaded = true;
        assert.strictEqual(ev.target.result.length, fileDataUrl.length + fileBase64.length);
      });
      fileReader.onload = function (ev) {
        assert.strictEqual(count, 1);
        assert.ok(onloaded);
        assert.strictEqual(ev.target.result.length, fileDataUrl.length + fileBase64.length);
        next();
      };

      fileReader.setNodeChunkedEncoding(false);
      fileReader.readAsDataURL(new File(fileData));
    })


    // Give Path
    // Test chunked encoding
    .then(function (next) {
      var fileReader = new FileReader(),
        size = 0,
        count = 0;

      
      // non-standard, node-only `data`
      fileReader.addEventListener('data', function (data) {
        count += 1;
        size += data.length;
        //console.log("chunk:", data.length);
      });


      fileReader.addEventListener('load', function (ev) {
        assert.ok(count > 1);
        assert.strictEqual(ev.target.result.length, fileDataUrl.length + fileBase64.length);
        assert.strictEqual(ev.target.nodeBufferResult.length, fileBuffer.length);
        assert.strictEqual(size, fileBuffer.length);
        next();
      });


      fileReader.setNodeChunkedEncoding(true);
      fileReader.readAsDataURL(new File(fileData));
    })


    // Give Buffer
    .then(function (next) {
      var fileReader = new FileReader();

      fileReader.addEventListener('load', function (ev) {
        assert.strictEqual(ev.target.result.length, fileDataUrl.length + fileBase64.length);
        fileData.buffer = undefined;
        delete fileData.buffer;
        next();
      });

      fileData.buffer = fileBuffer;
      // will not matter when the data is a buffer
      fileReader.setNodeChunkedEncoding(chunkedEncoding);
      fileReader.readAsDataURL(new File(fileData));
    })


    // Give Stream
    .then(function (next) {
      var fileReader = new FileReader(),
        fileStream = fs.createReadStream(fileData.path),
        size = 0;

      // non-standard, node-only
      fileReader.addEventListener('data', function (data) {
        size += data.length;
      });

      fileReader.addEventListener('load', function (ev) {
        assert.strictEqual(ev.target.result.length, fileDataUrl.length + fileBase64.length);
        assert.strictEqual(ev.target.nodeBufferResult.length, fileBuffer.length);
        assert.strictEqual(size, fileBuffer.length);
        fileData.stream = undefined;
        delete fileData.stream;
        next();
      });

      fileData.stream = fileStream;
      // will not matter when the data is a stream
      fileReader.setNodeChunkedEncoding(chunkedEncoding);
      fileReader.readAsDataURL(new File(fileData));
    })



    //
    // Test readAsXyz methods
    //

    // ArrayBuffer
    .then(function (next) {
      var fileReader = new FileReader();

      fileReader.addEventListener('load', function (ev) {
        assert.strictEqual(ev.target.result.length, fileBuffer.length);
        next();
      });

      fileData.buffer = fileBuffer;
      fileReader.readAsArrayBuffer(new File(fileData));
    })


    // BinaryString
    .then(function (next) {
      var fileReader = new FileReader();

      fileReader.addEventListener('load', function (ev) {
        assert.strictEqual(ev.target.result.length, fileBuffer.toString('binary').length);
        next();
      });

      fileData.buffer = fileBuffer;
      fileReader.readAsBinaryString(new File(fileData));
    })


    // Text
    .then(function (next) {
      var fileReader = new FileReader();

      fileReader.addEventListener('load', function (ev) {
        assert.strictEqual(ev.target.result.length, fileBuffer.toString('utf8').length);
        assert.strictEqual(ev.target.result.length, fileBuffer.toString('ascii').length);
        next();
      });

      fileData.buffer = fileBuffer;
      fileReader.readAsText(new File(fileData));
    })


    // DataURL well-tested in first section


    // Pass
    .then(function (next) {
      console.log("No test failed assertions. Reached final test. All tests (ostensibly) passed.");
      next();
    });

  if ('undefined' === typeof provide) { provide = function() {}; }
  provide('html5-file-api-test');
}());
