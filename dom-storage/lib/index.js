/*jshint node:true es5:true laxcomma:true laxbreak:true*/
// http://www.rajdeepd.com/articles/chrome/localstrg/LocalStorageSample.htm

// NOTE:
// this varies from actual localStorage in some subtle ways

// also, there is no persistence
// TODO persist
(function () {
  "use strict";

  var fs = require('fs')
    ;

  function Storage(path) {
    var db
      ;

    Object.defineProperty(this, '___priv_bk___', {
        value: {
            path: path
        }
      , writable: false
      , enumerable: false
    });

    try {
      db = JSON.parse(fs.readFileSync(path));
    } catch(e) {
      db = {};
    }

    Object.keys(db).forEach(function (key) {
      this[key] = db[key];
    }, this);
  }

  Storage.prototype.getItem = function (key) {
    if (key in this) {
      return String(this[key]);
    }
    return null;
  };

  Storage.prototype.setItem = function (key, val) {
    this[key] = String(val);
    this.___save___();
  };

  Storage.prototype.removeItem = function (key) {
    delete this[key];
    this.___save___();
  };

  Storage.prototype.clear = function () {
    var self = this;
    // filters out prototype keys
    Object.keys(self).forEach(function (key) {
      self[key] = undefined;
      delete self[key];
    });
  };

  Storage.prototype.key = function (i) {
    i = i || 0;
    return Object.keys(this)[i];
  };

  Storage.prototype.__defineGetter__('length', function () {
    return Object.keys(this).length;
  });

  Storage.prototype.___save___ = function () {
    var self = this
      ;

    if (!this.___priv_bk___.path) {
      return;
    }

    if (this.___priv_bk___.lock) {
      this.___priv_bk___.wait = true;
      return;
    }

    this.___priv_bk___.lock = true;
    fs.writeFile(this.___priv_bk___.path, JSON.stringify(this), 'utf8', function (e) {
      self.___priv_bk___.lock = false;
      if (e) {
        return;
      }
      if (self.___priv_bk___.wait) {
        self.___priv_bk___.wait = false;
        self.___save___();
      }
    });
  };

  Object.defineProperty(Storage, 'create', {
      value: function (path) {
        return new Storage(path);
      }
    , writable: false
    , enumerable: false
  });

  module.exports = Storage;
}());
