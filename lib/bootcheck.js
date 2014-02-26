/**
 * Boot checks
 *
 * A list of things to check before starting the server
 */

var getDb = require('./connect');

exports = module.exports = bootcheck;

function bootcheck(options) {
  getDb(function(err) {
    if (err) {
      console.error('Failed to connect to mongod');
      process.exit(1);
    }
  });
}