var db = require('../lib/db');
var path = require('path');

/*
 * Fetch a single clip
 */
exports.fetch = function(req, res, next) {
  var hash = req.params.hash;

  db.fetchItemByHash(hash, function(err, item) {
    if (err) res.send(500);

    res.sendfile(path.join(process.cwd(), item.relativePathLong));
  });
};


/*
 * Handle clip downloading
 */
exports.send = function(req, res, next) {
  res.send('download file here');
};