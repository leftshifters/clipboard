/**
 * Boot checks
 *
 * A list of things to check before starting the server
 */

var getDb = require('./connect');

exports = module.exports = bootcheck;

function bootcheck(options) {
  getDb(function(err, db) {
    if (err) throw err;

    db.ensureIndex('uploads', [['basenameWithoutExt', 1], ['createdms', -1]], function(err) {
      if (err) throw err;
    });
  });
}
