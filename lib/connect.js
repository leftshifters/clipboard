var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;

var db;
var mongoclient = new MongoClient(new Server('localhost', 27017), { native_parser: true });

exports = module.exports = getDb;

function getDb(done) {

  if (db) return done(null, db);

  mongoclient.open(function(err, mongoclient) {
    if (err) done(err);

    db = mongoclient.db('leftload');
    done(null, db);
  });

}