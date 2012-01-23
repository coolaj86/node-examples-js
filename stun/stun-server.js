(function (undefined) {
  "use strict";
  var fs = require('fs'),
    dgram = require('dgram'),
    port = 3500,
    host = process.argv[2] || '0.0.0.0', //'localhost',
    file = process.argv[3] || '/tmp/log.dat', // where to log data
    server,
    count = 0;

  require('remedial'); // String.supplant

  function openDataLogStream(fd) {
    server = dgram.createSocket("udp4");

    server.on('listening', function () {
      var address = server.address();
      console.log('server listening on {address}:{port}'.supplant({ 
        address: address.address,
        port: address.port
      }));
    });

    server.on('message', function (msg, rinfo) {
      console.log('data chunk received from {address}:{port}'.supplant({
        address: rinfo.address,
        port: rinfo.port
      }));

      var message = new Buffer(count += 1);
      client = dgram.createSocket("udp4");
      client.send(message, 0, message.length, rinfo.port, rinfo.address);
      client.close();

      console.log(msg.toString());
      fs.write(fd, msg, 0, msg.length, null, function (err, written) {
        if (err) {
          throw err;
        }
      });
    });

    server.bind(port);
  }

  // Write stream to file once it is ready
  fs.open(file, 'a', function(err, fd) {
    if (err) {
      throw err;
    }
    openDataLogStream(fd);
  });
}());
