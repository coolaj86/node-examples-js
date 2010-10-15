// A nodejs port of the PHP example
// http://developers.facebook.com/docs/authentication/

var keys = require('./private'),
  querystring = require('querystring'),
  sys = require('sys'),
  crypto = require('crypto'),
  http = require('http');

var FACEBOOK_APP_ID = keys.facebook().app_id,
  FACEBOOK_SECRET = keys.facebook().secret;

function get_facebook_cookie(app_id, application_secret, cookies) {
  var args = [],
    payload = '',
    fb_cookie;

  fb_cookie = cookies['fbs_' + app_id] || '';
  sys.puts(JSON.stringify({fb_cookie : fb_cookie}) + "\n");
  args = querystring.parse(fb_cookie.replace(/\\/,'').replace(/"/,''));
  sys.puts(JSON.stringify({args : args}) + "\n");

  var keys = Object.keys(args).sort();
  keys.forEach(function(key) {
    var value = args[key];
    if (key !== 'sig') {
      payload += key + '=' + value;
    }
  });

  var digest = crypto.createHash('md5').update(payload + application_secret).digest('hex');
  sys.puts(JSON.stringify({cookie: digest, expected: args.sig}) + "\n");
  if (digest !== args['sig']) {
    return null;
  }
  return args;
}

function single_sign_on_example(req, resp) {
  var cookie = get_facebook_cookie(FACEBOOK_APP_ID, FACEBOOK_SECRET, req.cookies);
  var present = cookie ? "Your user ID is " + cookie.uid : "<fb:login-button></fb:login-button>";

  console.log('validated with access token: ' + cookie.access_token);

  var blah = '<!DOCTYPE html>\n' +
  '<html xmlns="http://www.w3.org/1999/xhtml"\n' +
  '      xmlns:fb="http://www.facebook.com/2008/fbml">\n' +
  '  <body>\n' +
  present + '\n' +
  '    <div id="fb-root"></div>\n' +
  '    <script src="http://connect.facebook.net/en_US/all.js"></script>\n' +
  '    <script>\n' +
  '      FB.init({appId: ' + FACEBOOK_APP_ID + ', status: true,\n' +
  '               cookie: true, xfbml: true});\n' +
  '      FB.Event.subscribe("auth.login", function(response) {\n' +
  '        window.location.reload();\n' +
  '      });\n' +
  '    </script>\n' +
  '  </body>\n' +
  '</html>\n';
  resp.writeHead(200);
  resp.write(blah);

  console.log('written half');

  var fb_client = http.createClient('443', 'graph.facebook.com', true);
  console.log('created client');

  var graph_request = fb_client.request('GET', '/me?access_token=' + cookie.access_token,
    {'host': 'graph.facebook.com'});
  console.log('created request');
  graph_request.end();
  console.log('ended request');

  graph_request.on('response', function (response) {
    console.log('STATUS: ' + response.statusCode);
    console.log('HEADERS: ' + JSON.stringify(response.headers));
    response.setEncoding('utf8');

    response.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
      resp.write(chunk);
    });

    response.on('end', function () {
      console.log('END');
      resp.end();
    });

  });
}

module.exports = single_sign_on_example;
