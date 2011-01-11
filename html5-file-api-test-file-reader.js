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
    file;




  sequence


    // By file name with options
    .then(function (next) {
      var fileReader = new FileReader(new File(fileData));
      console.log(fileReader);
      //assert.deepEqual(file, fileData);
      
      //next();
    })


    // By file name with sync data for size and lastModified
    .then(function (next) {
      fileData.jsdom = true; 
      file = new File(fileData);
      delete file.stat;
      file.lastModifiedDate = file.lastModifiedDate.toISOString();
      assert.deepEqual(file, { path: './files/coolaj86-2010.jpg'
        , name: 'coolaj86-2010.jpg'
        , type: 'image/jpeg'
        , jsdom: true
        , lastModifiedDate: lastModifiedDate
        , size: fileStat.size
      });
      next();
    })


    // By file name with async data for stat
    .then(function (next) {
      fileData.async = true; 
      file = new File(fileData);
      assert.deepEqual(file, { path: './files/coolaj86-2010.jpg'
        , name: 'coolaj86-2010.jpg'
        , type: 'image/jpeg'
        , jsdom: true
        , async: true
      });
      setTimeout(function () {
        delete file.stat;
        file.lastModifiedDate = file.lastModifiedDate.toISOString();
        assert.deepEqual(file, { path: './files/coolaj86-2010.jpg'
          , name: 'coolaj86-2010.jpg'
          , type: 'image/jpeg'
          , jsdom: true
          , async: true
          , lastModifiedDate: lastModifiedDate
          , size: fileStat.size
        });
        next();
      }, 100);
    })


    // Using file buffer
    .then(function (next) {
      fs.readFile(fileData.path, function (err, data) {
        var fileBuffer = {
          name: "coolaj86-2010.jpg",
          buffer: data
        };

        file = new File(fileBuffer);
        delete file.buffer;
        assert.deepEqual(file, { name: fileData.name
          , type: 'image/jpeg'
          , size: fileStat.size
        });
        next();
      });
    })


    // Using file stream
    .then(function (next) {
      var fileStream = {
        name: fileData.name,
        stream: fs.createReadStream(fileData.path)
      };

      file = new File(fileStream);
      delete file.stream;
      assert.deepEqual(file, { name: fileData.name
        , type: 'image/jpeg'
      });
      next();
    })


    // Passes!
    .then(function (next) {
      console.log("all tests pass");
    });


  if ('undefined' === typeof provide) { provide = function() {}; }
  provide('html5-file-api-test');
}());
