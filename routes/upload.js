var multiparty = require('multiparty');
var _ = require('lodash');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var gm = require('gm');
var async = require('async');

var db = require('../lib/db');
// var disksize = require('../lib/disksize');
var manifest = require('../lib/manifest');
var baseurl = require('../lib/baseurl');
var search = require('../lib/search');
var cliputils = require('../lib/cliptils');

var uploadDir = 'public/uploads';
var thumbsDir = '/public/thumbs';

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

function type(item, done) {
  var ext = path.extname(item.basename);
  if (ext === '.ipa') {
    item.type = 'ipa';
    return manifest(uploadPath, item, done);
  } else if (ext === '.apk') {
    item.type = 'apk';
  }

  done(null, item);
}

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
    var baseuri = req.protocol + '://' + req.headers.host;
    var basename, mimetype, date, basenameWithoutExt, extension;

    if (file && file.fieldName === 'content') {
      basename = path.basename(file.path);
      basenameWithoutExt = path.basename(file.path, path.extname(file.path));
      extension = path.extname(file.path);
      mimetype = mime.lookup(file.path);
      date = new Date();
      var item = {
        mime: mimetype,
        height: 0,
        width: 0
      };

      async.waterfall([
        function calculateSize(cb) {
          if (!!~imageMimes.indexOf(mimetype)) { // eslint-disable-line no-extra-boolean-cast
            gm(file.path).size(function(gmerr, size) {
              if (gmerr) {
                return cb(gmerr);
              }

              item.height = size.height;
              item.width = size.width;
              cb(null, item);
            });
          } else {
            cb(null, item);
          }
        },

        function AddImage(item, cb) { // eslint-disable-line no-shadow
          item = _.extend(item, {
            hash: '',
            size: file.size,
            basename: basename,
            basenameWithoutExt: basenameWithoutExt,
            extension: extension,
            originalName: file.originalFilename,
            relativePathShort: 'uploads/' + basename,
            relativePathLong: uploadDir + '/' + basename,
            relativeThumbPathShort: '',
            relativeThumbPathLong: '',
            name: fields.name && fields.name.shift() || 'untitled',
            type: '',
            bundleId: fields.bundleId && fields.bundleId.shift() || '',
            created: date.toISOString(),
            createdms: date.getTime()
          });

          cliputils.seturl(item, baseuri);

          if (item.type === 'ipa') {
            item.url = cliputils.ipaurl(item, baseuri);
          }

          if (item.type === 'image') {
            item.imageurl = '../' + item.relativePathShort;
          }

          cliputils.type(item);
          cliputils.setname(item);
          cliputils.settimeago(item);

          if (!!~imageMimes.indexOf(mimetype)) { // eslint-disable-line no-extra-boolean-cast
            item.type = 'image';
          }

          type(item, function(err, item) { // eslint-disable-line no-shadow
            if (err) {
              return cb(err);
            }

            db.insertItem(item, function(err, results) { // eslint-disable-line no-shadow
              if (err) {
                return cb(err);
              }
              req.store._id = results.insertedIds[0]; // eslint-disable-line no-underscore-dangle
              cb(null, item);
            });
          });
        }
      ], function(err, item) { // eslint-disable-line no-shadow
        if (err) {
          return next(err);
        }

        req.store.data = req.store.item = item;
        next();
      });
    }
  });

};

exports.thumb = function(req, res, next) {
  return next();

  // var item = req.store.item;
  // if (!item) return next();
  // if (item.type !== 'image') return next();

  // var inp = path.join(process.cwd(), item.relativePathLong);
  // var out = path.join(thumbsPath, item.basename);

  // gm(inp)
  //   .resize(300, 300)
  //   .write(out, function done(err) {
  //     if (err) return console.error(err);
  //     next();
  //   });

};

exports.diskspace = function(req, res, next) {
  // var total = 0;
  // var free = 0;
  next();
  // req.app.locals.disksize.total = total;
  // req.app.locals.disksize.free = free;


  // disksize(function onsize(err, total, free) { // eslint-disable-line no-shadow
  //   if (err) {
  //     return next();
  //   }

  //   req.app.locals.disksize.total = total;
  //   req.app.locals.disksize.free = free;
  //   next();
  // });
};

exports.addSearchIndex = function(req, res, next) {
  search.add(req.store.item);
  next();
};
