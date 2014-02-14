var multiparty = require('multiparty');
var path = require('path');
var mime = require('mime');
var fs = require('fs');

var getDb = require('../lib/connect');

var uploadDir = 'public/uploads';
var uploadPath = path.join(process.cwd(), uploadDir);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
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

exports.upload = function(req, res) {

  var form = new multiparty.Form({
    autoFiles: true,
    uploadDir: path.join(process.cwd(), uploadDir)
  });

  form.parse(req, function(err, fields, files) {

    var file = files.content && files.content[0];
    var basename, mimetype, date;

    if (file && file.fieldName === 'content') {
      basename = path.basename(file.path);
      mimetype = mime.lookup(file.path);
      date = new Date();

      var item = {
        basename: basename,
        originalName: file.originalFilename,
        relativePathShort: 'uploads/' + basename,
        relativePathLong: uploadDir + '/' + basename,
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

      getDb(function(err, db) {
        if (err) return console.error(err);

        db.collection('uploads').insert(item, function(err) {
          if (err) res.send(500);

          res.redirect('/');
        });

      });

    }

  });

};