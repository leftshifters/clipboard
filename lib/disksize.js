var diskspace = require('diskspace');
var bytes = require('bytes');

exports = module.exports = disksize;

function disksize(fn) {
  diskspace.check('/', function(err, total, free) {
    if (err) {
      return fn(err);
    }

    fn(bytes(total), bytes(free));
    if (err) return fn(err);
    fn(null, bytes(total), bytes(free));
  });
}
