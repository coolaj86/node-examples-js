module.exports = {
  facebook : function () {
    throw Error('Change these keys before use');
    return {
      app_id: '999999999999',
      secret: 'ffffffffffffffffffffffffffffffff'
    };
  }
  couchdb: function () {
    throw Error('Change these keys before use');
    return {
      port: '80',
      domain: 'YOUR_COUCH.couchone.com',
      user: 'YOUR_USER',
      password: 'YOUR_PASSWORD'
    };
  }
};
