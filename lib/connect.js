var MongoClient = require('mongodb').MongoClient;

/**
 * cache for the db object
 */
var db;

/**
 * host, port & database name
 */
var host = process.env.MONGO_HOST || 'localhost';
var port = process.env.MONGO_PORT || 27017;
var dbname = process.env.MONGO_DB_NAME || 'clipboard';


/*!
 * module exports
 */
exports = module.exports = getDb;

/**
 * Returns the database object
 * @param {Function} done
 * @api public
 * @return {Callback}
 */
function getDb(done) {

  if (db) {
    return done(null, db);
  }

  MongoClient.connect('mongodb://' + host + ':' + port + '/' + dbname, function(err, newdb) {
    if (err) {
      return done(err);
    }

    done(null, newdb);
  });

}
