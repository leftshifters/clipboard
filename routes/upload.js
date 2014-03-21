var multiparty = require('multiparty');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var gm = require('gm');
var _ = require('underscore');
var db = require('../lib/db');
var disksize = require('../lib/disksize');

var uploadDir = 'public/uploads';
var thumbsDir = 'public/thumbs';
var baseurl;
var uploadPath = path.join(process.cwd(), uploadDir);
var thumbsPath = path.join(process.cwd(), thumbsDir);

var manifestTemplate;

fs.readFile(path.join(process.cwd(), 'data/manifest.tpl'), { encoding: 'utf8' }, function(err, filecontent) {
  if (err) throw err;
  manifestTemplate = filecontent;
});

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

  sethost(req);

  var form = new multiparty.Form({
    autoFiles: true,
    uploadDir: path.join(process.cwd(), uploadDir)
  });

  form.parse(req, function(err, fields, files) {

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

      if (!!~imageMimes.indexOf(mimetype)) {
        item.type = 'image';
      }

      type(item);

      db.insertItem(item, function(err, results) {
        if (err) return res.send(500);
        req.store.item = item;
        next();
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

exports.done = function(req, res, next) {
  disksize(req.app);
  res.redirect('/');
};

function type(item) {
  var ext = path.extname(item.basename);

  if ('.ipa' === ext) {
    item.type = 'ipa';
    manifest(item);
  } else if ('.apk' === ext) {
    item.type = 'apk';
  }
}

function manifest(item) {
  var basename = path.basename(item.basename, '.ipa');
  var plistfile = basename + '.plist';
  var url = baseurl + '/' + item.relativePathShort;

  var manifest = _.template(manifestTemplate, {
    name: item.name || 'untitled',
    bundleId: item.bundleId || '',
    url: url
  });

  fs.writeFile(path.join(uploadPath, plistfile), manifest, function(err) {
    if (err) console.error(err);
  });
}

function sethost(req) {
  baseurl = req.protocol + '://' + req.headers.host;
}