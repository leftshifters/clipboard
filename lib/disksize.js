var diskspace = require('diskspace');
var bytes = require('bytes');

exports = module.exports = disksize;

function disksize(fn) {
  diskspace.check('/', function(total, free) {
    fn(bytes(total), bytes(free));
  });
}