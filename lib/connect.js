var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;

var db;
var host = process.env.MONGO_HOST || 'localhost';
var port = process.env.MONGO_PORT || 27017;
var dbname = process.env.MONGO_DB_NAME || 'clipboard';

var mongoclient = new MongoClient(new Server(host, port), { native_parser: true });

exports = module.exports = getDb;

function getDb(done) {

  if (db) return done(null, db);

  mongoclient.open(function(err, mongoclient) {
    if (err) return done(err);

    db = mongoclient.db(dbname);
    done(null, db);
  });

}