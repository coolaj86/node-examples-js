var keys = require('./private').couchdb(),
  connect = require('connect'),
  couch = require('couchdb'),
  client = couch.createClient(keys.port, keys.domain, keys.user, keys.password),
  db = client.db('syllabi');

/*
 * Create a database 'myDB'
 * Create a view 'all'
 * put all documents into that view with no key (no sorting)
 * and with no descrimitation (all keys)
 */
var myDb = "exampledb"
client.request('put', '/' + myDb);
db.saveDesign(myDb, {
  views: {
    "all": {
      map: function(doc) {
        emit(null, doc);
      }
    }
  }
});


var coolaj86 = {
  name: "AJ ONeal",
  email: "coolaj86@email.com",
  phone: "777-555-2121"
},
mvndaai = {
  name: "Jason Mavandi",
  email: "mvndaai@email.com",
};

function log(err, data) {
  console.log('err: ' + err);
  console.log('data: ' + JSON.stringify(data));
}

db.saveDoc(coolaj86.email, coolaj86, log);
db.saveDoc(mvndaai.email, mvndaai, log);

db.getDoc(coolaj86.email, log);
db.getDoc(mvndaai.email, log);

db.view(myDb, 'all', {}, log);
