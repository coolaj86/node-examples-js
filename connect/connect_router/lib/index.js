/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true*/
(function () {
"use strict";
/*!
 * Connect - router
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var utils = require('../utils')
  , parse = require('url').parse
  , routerMethods
  ;

/**
 * Expose router.
 */

module.exports = mainRouter;

/**
 * Supported HTTP / WebDAV methods.
 */

routerMethods = mainRouter.methods = [
    'get'
  , 'post'
  , 'patch'
  , 'put'
  , 'delete'
  , 'connect'
  , 'options'
  , 'trace'
  , 'copy'
  , 'lock'
  , 'mkcol'
  , 'move'
  , 'propfind'
  , 'proppatch'
  , 'unlock'
  , 'report'
  , 'mkactivity'
  , 'checkout'
  , 'merge'
];

/**
 * Provides Sinatra and Express-like routing capabilities.
 *
 * Examples:
 *
 *     connect.router(function(app){
 *       app.get('/user/:id', function(req, res, next){
 *         // populates req.params.id
 *       });
 *       app.put('/user/:id', function(req, res, next){
 *         // populates req.params.id
 *       });
 *     })
 *
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

function mainRouter(fn) {
  /*jshint validthis:true*/
  var self = this
    , methods = {}
    , routes = {}
    , params = {};

  if (!fn) throw new Error('router provider requires a callback function');

  // Generate method functions
  routerMethods.forEach(function(method){
    methods[method] = generateMethodFunction(method.toUpperCase());
  });

  // Alias del -> delete
  methods.del = methods.delete;

  // Apply callback to all methods
  methods.all = function(){
    var args = arguments;
    routerMethods.forEach(function(name){
      methods[name].apply(this, args);
    });
    return self;
  };

  // Register param callback
  methods.param = function(name, fn){
    params[name] = fn;
  };
      
  fn.call(this, methods);

  function generateMethodFunction(name) {
    var localRoutes = routes[name] = routes[name] || [];
    return function(path, fn){
      var keys = []
        , middleware = []
        , regexp
        ;

      // slice middleware
      if (arguments.length > 2) {
        middleware = Array.prototype.slice.call(arguments, 1, arguments.length);
        fn = middleware.pop();
        middleware = utils.flatten(middleware);
      }

      fn.middleware = middleware;

      if (!path) throw new Error(name + ' route requires a path');
      if (!fn) throw new Error(name + ' route ' + path + ' requires a callback');
      regexp = path instanceof RegExp
        ? path
        : normalizePath(path, keys);
      localRoutes.push({
          fn: fn
        , path: regexp
        , keys: keys
        , orig: path
        , method: name
      });
      return self;
    };
  }

  function router(req, res, next){
    /*jshint validthis:true*/
    var route
      , self = this
      ;

    (function pass(i){
      var keys
        ;

      route = match(req, routes, i);
      if (route) {
        i = 0;
        keys = route.keys;

        req.params = route.params;

        // Param preconditions
        (function param(err) {
          try {
            var key = keys[i++]
              , val = req.params[key]
              , fn = params[key];

            if ('route' == err) {
              pass(req._route_index + 1);
            // Error
            } else if (err) {
              next(err);
            // Param has callback
            } else if (fn) {
              // Return style
              if (1 == fn.length) {
                req.params[key] = fn(val);
                param();
              // Middleware style
              } else {
                fn(req, res, param, val);
              }
            // Finished processing params
            } else if (!key) {
              // route middleware
              i = 0;
              (function nextMiddleware(err){
                var fn = route.middleware[i++];
                if ('route' == err) {
                  pass(req._route_index + 1);
                } else if (err) {
                  next(err);
                } else if (fn) {
                  fn(req, res, nextMiddleware);
                } else {
                  route.call(self, req, res, function(err){
                    if (err) {
                      next(err);
                    } else {
                      pass(req._route_index + 1);
                    }
                  });
                }
              })();
            // More params
            } else {
              param();
            }
          } catch (err) {
            next(err);
          }
        })();
      } else if ('OPTIONS' == req.method) {
        options(req, res, routes);
      } else {
        next();
      }
    })();
  }

  router.remove = function(path, method){
    var fns = router.lookup(path, method);
    fns.forEach(function(fn){
      routes[fn.method].splice(fn.index, 1);
    });
  };

  router.lookup = function(path, method, ret){
    ret = ret || [];

    // method specific lookup
    if (method) {
      method = method.toUpperCase();
      if (routes[method]) {
        routes[method].forEach(function(route, i){
          if (path == route.orig) {
            var fn = route.fn;
            fn.regexp = route.path;
            fn.keys = route.keys;
            fn.path = route.orig;
            fn.method = route.method;
            fn.index = i;
            ret.push(fn);
          }
        });
      }
    // global lookup
    } else {
      routerMethods.forEach(function(method){
        router.lookup(path, method, ret);
      });
    }

    return ret;
  };

  router.match = function(url, method, ret){
    var i = 0
      , fn
      , req
      ;

    ret = ret || [];

    // method specific matches
    if (method) {
      method = method.toUpperCase();
      req = { url: url, method: method };

      while (true) {
        fn = match(req, routes, i);
        if (!fn) {
          break;
        }
        i = req._route_index + 1;
        ret.push(fn);
      } 
    // global matches
    } else {
      routerMethods.forEach(function(method){
        router.match(url, method, ret);
      });
    }

    return ret;
  };

  return router;
}

/**
 * Respond to OPTIONS.
 *
 * @param {ServerRequest} req
 * @param {ServerResponse} req
 * @param {Array} routes
 * @api private
 */

function options(req, res, routes) {
  var pathname = parse(req.url).pathname
    , body = optionsFor(pathname, routes).join(',');
  res.writeHead(200, {
      'Content-Length': body.length
    , 'Allow': body
  });
  res.end(body);
}

/**
 * Return OPTIONS array for the given `path`, matching `routes`.
 *
 * @param {String} path
 * @param {Array} routes
 * @return {Array}
 * @api private
 */

function optionsFor(path, routes) {
  return routerMethods.filter(function(method){
    var arr = routes[method.toUpperCase()]
      , i
      , len = arr.length
      ;

    for (i = 0; i < len; i += 1) {
      if (arr[i].path.test(path)) return true;
    }
  }).map(function(method){
    return method.toUpperCase();
  });
}

/**
 * Normalize the given path string,
 * returning a regular expression.
 *
 * An empty array should be passed,
 * which will contain the placeholder
 * key names. For example "/user/:id" will
 * then contain ["id"].
 *
 * @param  {String} path
 * @param  {Array} keys
 * @return {RegExp}
 * @api private
 */

function normalizePath(path, keys) {
  path = path
    .concat('/?')
    .replace(/\/\(/g, '(?:/')
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
      keys.push(key);
      slash = slash || '';
      return ''
        + (optional ? '' : slash)
        + '(?:'
        + (optional ? slash : '')
        + (format || '') + (capture || '([^/]+?)') + ')'
        + (optional || '');
    })
    .replace(/([\/.])/g, '\\$1')
    .replace(/\*/g, '(.+)');
  return new RegExp('^' + path + '$', 'i');
}

/**
 * Attempt to match the given request to
 * one of the routes. When successful
 * a route function is returned.
 *
 * @param  {ServerRequest} req
 * @param  {Object} routes
 * @return {Function}
 * @api private
 */

function match(req, routes, i) {
  var captures
    , method = req.method
    , url
    , pathname
    , len
    , route
    , fn
    , path
    , keys
    , j
    , key
    , val
    ;

  i = i || 0;
  if ('HEAD' == method) method = 'GET';
  routes = routes[method];
  if (routes) {
    url = parse(req.url);
    pathname = url.pathname;

    for (len = routes.length; i < len; ++i) {
      route = routes[i];
      fn = route.fn;
      path = route.path;
      keys = fn.keys = route.keys;

      captures = path.exec(pathname);
      if (captures) {
        fn.method = method;
        fn.params = [];
        for (j = 1, len = captures.length; j < len; ++j) {
          key = keys[j-1];
          val = typeof captures[j] === 'string'
              ? decodeURIComponent(captures[j])
              : captures[j];
          if (key) {
            fn.params[key] = val;
          } else {
            fn.params.push(val);
          }
        }
        req._route_index = i;
        return fn;
      }
    }
  }
}
}());
