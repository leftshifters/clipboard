var diskspace = require('diskspace');
var bytes = require('bytes');

exports = module.exports = disksize;

function disksize(fn) {
  diskspace.check('/', function(err, total, free) {
<<<<<<< HEAD
    if (err) {
      return fn(err);
    }

    fn(bytes(total), bytes(free));
=======
    if (err) return fn(err);
    fn(null, bytes(total), bytes(free));
>>>>>>> 1278f9054d15561682bcc0cbc925bf415500542e
  });
}
