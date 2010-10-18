var connect = require('connect'),
  fs = require('fs'),
  path = require('path'),
  apps = [],
  dirs = fs.readdirSync("./vhosts/");

apps.push(connect.staticProvider(__dirname + '/public'));

// TODO use futures to asyncify
dirs.forEach(function (dir) {
  dir = __dirname + '/vhosts/' + dir;
  var file = dir + '/app.js',
    app = dir + '/app',
    stats;

  try {
    stats = fs.statSync(file);
  } catch(e) {
    console.log(file + " doesn't exist");
    return;
  }

  if (stats.isFile()) {
    console.log("loading middleware '" + app + "'");
    apps.push(require(app));
  }
});

apps.push(function(req, res){
  res.writeHead(200, {});
  res.end('local (vhost)');
});

module.exports = connect.createServer.apply(connect, apps);
