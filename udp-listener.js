(function () {
  var dgram = require('dgram'),
    server,
    address = "0.0.0.0", // any available addresses
    port = 25000, // change as you wish
    protocol = "udp4";
    

  server = dgram.createSocket(protocol);

  server.on("message", function (msg, rinfo) {
    console.log("server got: " + msg + " from " +
      rinfo.address + ":" + rinfo.port);
  });

  server.on("listening", function () {
    var address = server.address();
    console.log("server listening " +
        address.address + ":" + address.port);
  });

  server.bind(port, address);
  // Expected Output: server listening 0.0.0.0:41234
  // If you get "Error: EADDRINUSE, Address already in use", choose a different port number
}());
