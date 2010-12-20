var net = require('net'),
  fs = require('fs'),
  sock = '/tmp/overhead-test.sock',
  server,
  stream,
  recv_t;

try {
  fs.unlinkSync(sock);
} catch(e) {}

server = net.createServer(function (stream) {
  stream.setEncoding('utf8');
  //stream.on('connect', function () {
  //  stream.write('hello\r\n');
  //});
  stream.on('data', function (data) {
    recv_t = (new Date()).valueOf();
    console.log('[recv] ' + recv_t);
  });
  stream.on('end', function () {
    stream.end();
  });
});
server.listen(sock);
