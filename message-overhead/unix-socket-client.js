var net = require('net'),
  fs = require('fs'),
  sock = '/tmp/overhead-test.sock',
  server,
  stream,
  send_t;

stream = net.createConnection(sock);
stream.on('connect', function () {
  setInterval(function () {
    send_t = (new Date()).valueOf();
    console.log('[send] ' + send_t);
    stream.write('.');
    //stream.end();
  }, 500);
});
