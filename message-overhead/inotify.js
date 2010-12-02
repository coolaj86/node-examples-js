var inotify = require('inotify-plusplus').create(),
  exec = require('child_process').exec,
  path = require('path'),
  dir = '/tmp',
  file = 'inotify-test.file',
  send_t,
  recv_t;

inotify.watch({
  attrib: function (ev) {
    if (file == ev.name) {
      recv_t = (new Date()).valueOf();
      console.log('[diff] ' + (recv_t - send_t));
    }
  }
}, dir);

setInterval(function () {
  console.log('touch');
  send_t = (new Date()).valueOf();
  exec('touch ' + path.join(dir,file));
}, 500);
