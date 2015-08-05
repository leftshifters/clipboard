var multiparty = require('multiparty');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var gm = require('gm');
var debug = require('debug')('clipboard:upload');

var db = require('../lib/db');
var disksize = require('../lib/disksize');
var manifest = require('../lib/manifest');
var baseurl = require('../lib/baseurl');
var search = require('../lib/search');

var uploadDir = 'public/uploads';
var thumbsDir = 'public/thumbs';

var uploadPath = path.join(process.cwd(), uploadDir);
var thumbsPath = path.join(process.cwd(), thumbsDir);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

if (!fs.existsSync(thumbsPath)) {
  fs.mkdirSync(thumbsPath);
}

var imageMimes = [
  'image/png',
  'image/gif',
  'image/jpeg',
  'image/pjpeg',
  'image/bmp',
  'image/x-windows-bmp',
  'image/x-icon'
];

exports.upload = function(req, res, next) {

  baseurl.set(req.protocol, req.get('host'));

  var form = new multiparty.Form({
    autoFiles: true,
    uploadDir: path.join(process.cwd(), uploadDir)
  });

  form.parse(req, function(err, fields, files) {
    if (err) {
      console.error(err);
      return next(new Error('Internal Server Error'));
    }

    var file = files.content && files.content[0];
    var basename, mimetype, date, basenameWithoutExt, extension;

    if (file && file.fieldName === 'content') {
      basename = path.basename(file.path);
      basenameWithoutExt = path.basename(file.path, path.extname(file.path));
      extension = path.extname(file.path);
      mimetype = mime.lookup(file.path);
      date = new Date();

      var item = {
        hash: '',
        basename: basename,
        basenameWithoutExt: basenameWithoutExt,
        extension:extension,
        originalName: file.originalFilename,
        relativePathShort: 'uploads/' + basename,
        relativePathLong: uploadDir + '/' + basename,
        relativeThumbPathShort: '',
        relativeThumbPathLong: '',
        mime: mimetype,
        name: fields.name && fields.name.shift() || 'untitled',
        type: '',
        bundleId: fields.bundleId && fields.bundleId.shift() || '',
        created: date.toISOString(),
        createdms: date.getTime()
      };
      //console.log(item);

      if (!!~imageMimes.indexOf(mimetype)) {
        item.type = 'image';
      }

      type(item, function(err, item) {
        if (err) return res.send(500);

        db.insertItem(item, function(err, results) {
          if (err) return res.send(500);
          req.store.item = item;
          req.store._id = results.ops[0]._id;
          next();
        });
      });

    }

  });

};

exports.thumb = function(req, res, next) {
  return next();
  var item = req.store.item;
  if (!item) return next();
  if (item.type !== 'image') return next();

  var inp = path.join(process.cwd(), item.relativePathLong);
  var out = path.join(thumbsPath, item.basename);

  gm(inp)
    .resize(300, 300)
    .write(out, function done(err) {
      if (err) return console.error(err);
      next();
    });

};

exports.diskspace = function(req, res, next) {

  disksize(function onsize(err, total, free) {
    if (err) {
      debug(err);
    }

    req.app.locals.disksize.total = total || 0;
    req.app.locals.disksize.free = free || 0;

    next();
  });
};

exports.addSearchIndex = function(req, res, next) {
  search.add(req.store.item);
  next();
};


function type(item, done) {
  var ext = path.extname(item.basename);
   console.log(ext);
  if ('.ipa' === ext) {
    item.type = 'ipa';
    return manifest(uploadPath, item, done);
  } else if ('.apk' === ext) {
    item.type = 'apk';
  }

  done(null, item);
}
