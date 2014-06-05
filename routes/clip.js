var db = require('../lib/db');
var path = require('path');

/*
 * Fetch a single clip
 */
exports.fetch = function(req, res, next) {
  var hash = req.params.hash;

  db.fetchItemByHash(hash, function(err, item) {
    if (err) return res.send(500);
    if (!item) return res.send(404);

    req.store.item = item;
    next();
  });
};


/*
 * Handle clip downloading
 */
exports.send = function(req, res, next) {
  var item = req.store.item;

  if ('image' === item.type) {
    res.sendfile(path.join(process.cwd(), item.relativePathLong));
  } else {
    res.download(path.join(process.cwd(), item.relativePathLong), item.originalName);
  }
  
};