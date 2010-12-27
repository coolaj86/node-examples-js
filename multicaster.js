(function () {
  "use strict";

  var MAX_INT = Math.pow(2, 53);

  function StreamMulticaster() {
    var clients = {},
      count = 0,
      index = 0;

    function cleanup() {
      count = 0;
      index = 0;
      
      new_clients = {};
      Object.keys(clients).forEach(function (k) {
        var client = clients[k];

        if (index === MAX_INT) {
          throw new Error("No freakin' way! Clients maxed out!");
        }

        client.MULTICAST_ID = index;
        count += 1;

        new_clients[index] = client;
        clients = new_clients;

        index += 1;
      });
    }

    this.add = function (client) {
      client.MULTICAST_ID = index;

      /*
      if (index === MAX_INT) {
        cleanup();
      }
      */

      count += 1;
      clients[index] = client;

      function remove() {
        delete clients[client.MULTICAST_ID];
      }

      client.on('close', remove);
      index += 1;
    }

    this.size = function () {
      return count;
    };

    this.write = function (data) {
      Object.keys(clients).forEach(function (key) {
        clients[key].write(data);
      });
    };
  }

  module.exports = StreamMulticaster;
}());
