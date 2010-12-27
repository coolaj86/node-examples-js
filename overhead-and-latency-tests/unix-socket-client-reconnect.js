var net = require('net'),
  sock = '/tmp/overhead-test.sock',
  send_t;

setInterval(function () {
  send_t = (new Date()).valueOf();
  stream = net.createConnection(sock);
  stream.on('connect', function () {
    console.log('[send] ' + send_t);
    stream.write('.');
    stream.end();
  });
}, 500);
