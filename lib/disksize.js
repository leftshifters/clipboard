var diskspace = require('diskspace');
var bytes = require('bytes');

exports = module.exports = disksize;

function disksize(app) {
  diskspace.check('/', function(total, free) {
    app.locals({
      disksize: {
        total: bytes(total),
        free: bytes(free)
      }
    });
  });
};