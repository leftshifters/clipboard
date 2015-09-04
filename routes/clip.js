var db = require('../lib/db');
var baseurl = require('../lib/baseurl');
var path = require('path');
var QR = require('qr').Encoder;

/*
 * Fetch a single clip
 */
exports.fetch = function(req, res, next) {
  var hash = req.params.hash;

  db.fetchItemByHash(hash, function(err, item) {
    if (err) {
      return res.send(500);
    }

    if (!item) {
      return res.send(404);
    }

    // dunno, why mongodb is returning a wrapped object
    req.store.item = item.value;
    next();
  });
};

/*
 * Generate QR code
 */
exports.qr = function(req, res, next) {
  var item = req.store.item;
  var qr = new QR();

  if (!(item.type === 'ipa' || item.type === 'apk')) {
    return next();
  }

  baseurl.set(req.protocol, req.get('host'));
//next();
  qr.on('end', function onEncodingComplete(png) {
    item.qrImage = 'data:image/png;base64,' + png.toString('base64');
    req.store.item = item;
    next();
  });

  qr.encode([baseurl.get(), 'clipd', item.basenameWithoutExt].join('/'), null, {
    background_color: 'F8F5EE', // eslint-disable-line camelcase
    margin: 2,
    dot_size: 5 // eslint-disable-line camelcase
  });
};


/*
 * Handle clip downloading
 */
exports.send = function(req, res) {
  var item = req.store.item;
  if (item.type === 'image') {
    res.sendfile(path.join(process.cwd(), item.relativePathShort));
  } else {
    res.download(path.join(process.cwd(), item.relativePathShort), item.originalName);
  }

};
