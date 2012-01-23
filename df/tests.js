(function () {
  "use strict";

  var df = require('./index')
    , assert = require('assert')
    ;

  /*
  {
    "filesystem": "/dev/disk0s2",
    "blocks": 488555536,
    "used": 472631632,
    "available": 15411904,
    "percent": 97,
    "mountpoint": "/"
  }
  */

  df(function (err, devices) {
    devices.forEach(function (dev) {
      assert.ok(dev.filesystem.match(/^[^\s]+\s?[^\s]+$/), "doesn't look like a filesystem");
      assert.ok(dev.blocks >= 0, 'blocks < 0 || NaN');
      assert.ok(dev.used >= 0, 'used < 0 || NaN');
      assert.ok(dev.available >= 0, 'available < 0 || NaN');
      //assert.strictEqual(dev.blocks, dev.used + dev.available, 'blacks != used + avaiable');
      assert.ok(dev.percent >= 0 && dev.percent <= 100, 'not between 0 and 100 percent');
    });
    console.log(JSON.stringify(devices, null, '  '));
    console.info('[PASS] all attributes match expected patterns');
  });
}());
