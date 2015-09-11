/**
 * Boot checks
 *
 * A list of things to check before starting the server
 */

var getDb = require('./connect');

exports = module.exports = bootcheck;

function bootcheck() {
  getDb(function(err, db) {
    if (err) {
      throw new Error('Failed to connect to mongod');
    }

    db.ensureIndex('uploads', [['basenameWithoutExt', 1], ['createdms', -1]], function(newerr) {
      if (newerr) {
        throw new Error('Failed to create db indexes');
      }
    });
  });
}
