// curl -d '{"location":"apt_5"}' -i -X POST http://dd-wrt.coolaj86.info/imalive -H "Content-Type: application/json"
var fs = require('fs'),
  sys = require('sys'),
  connect = require('connect'),
  url = require('url'),
  rest,
  server,
  MDB = {};

function retract(obj, props) {
  var nobj = {};

  obj = obj || {};
  props.forEach(function (keyname) {
    nobj[keyname] = obj[keyname];
  });
  return nobj;
}

rest = function (app) {
  app.get('/routers', function(req, res) {
    try {
    var result = [];

    req.params = url.parse(req.url, true).query;

    Object.keys(MDB).forEach(function (item, key, collection) {
      if (MDB[item]) {
        result.push(MDB[item]);
      }
    });
    result = JSON.stringify(result);

    sys.puts('0there');
    res.writeHead(200, {'Content-Type': 'application/json'});
    if (req.params && req.params.callback) {
      result = req.params.callback + '(' + result + ')';
    }
    sys.puts('1there');
    res.end(result);
    sys.puts('2there');
    } catch(e) {}
  });

  app.get('/imalive/:location', function(req, res) {
    try {
    var result = '{"success": "yay"}', item = {};

    res.writeHead(200, {'Content-Type': 'application/json'});
    if (!req.params || !req.params.location) {
      res.end('{err: "sucks"}');
      return;
    }
    sys.puts('here0');
    item.location = req.params.location;
    item.remoteAddress = req.socket.remoteAddress;
    MDB[item.remoteAddress] = item;

    sys.puts('here1');
    res.write(result);
    sys.puts('here2');
    res.end();
    sys.puts('here3');
    } catch(e) {}
  });

  app.post('/imalive', function(req, res) {
    var result = '{"success": "yay"}', item;

    console.log(sys.inspect(req.socket.remoteAddress));

    res.writeHead(200, {'Content-Type': 'application/json'});
    if (!req.body || !req.body.location) {
      res.end('{err: "sucks"}');
      return;
    }
    item = retract(req.body, ["local_ip", "external_ip", "ethernet_mac", "location"]);
    item.remoteAddress = req.socket.remoteAddress;
    MDB[item.remoteAddress] = item;

    res.end(result);
  });
};

server = connect.createServer(
  // decode html forms
  connect.bodyDecoder(),
  // REST API
  connect.router(rest),
  // images, css, etc
  connect.staticProvider(__dirname + '/public'),
  // All other request redirect to index
  function(req, res){
    var emitter = fs.createReadStream(__dirname + "/public/index.html", {encoding: 'utf8'});
    res.writeHead(200, {'Content-Type': 'text/html'});
    emitter.on('data', function(data) {
      res.write(data);
    });
    emitter.on('end', res.end);
  }
);

module.exports = connect.createServer(
  connect.vhost('dd-wrt.coolaj86.info', server)
);
