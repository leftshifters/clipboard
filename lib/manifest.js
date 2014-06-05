var path = require('path');
var fs = require('fs');
var unzip = require('unzip');
var _ = require('underscore');
var bplist = require('bplist-parser');
var getBaseurl = require('./baseurl').get;
var manifestTemplate;

fs.readFile(path.join(process.cwd(), 'data/manifest.tpl'), { encoding: 'utf8' }, function(err, filecontent) {
  if (err) throw err;
  setManifestContent(filecontent);
});

function manifest(uploadPath, item, done) {
  var baseurl = getBaseurl();
  var basename = path.basename(item.basename, '.ipa');
  var plistfile = basename + '.plist';
  var url = baseurl + '/' + item.relativePathShort;

  extract(function(err, pkg) {
    if (err) {
      console.error(err);
      return done(new Error('Failed to extract info from IPA'));
    }

    pkg.url = url;
    item.bundleId = pkg.bundleId;
    var manifest = _.template(manifestTemplate, pkg);

    fs.writeFile(path.join(uploadPath, plistfile), manifest, function(err) {
      if (err) return console.error(err);
      done(null, item);
    });

  });

  function extract(done) {
    var toExtract = path.join(uploadPath, item.basename);

    fs.createReadStream(toExtract)
      .pipe(unzip.Parse())
      .on('entry', function(entry) {
        var split = entry.path.split('/');
        var name = entry.path.substr(-10);
        if (entry.type === 'File' && split.length === 3 && name === 'Info.plist') {
          var bufs = [];
          entry.on('data', function(chunk) {
            bufs.push(chunk);
          });

          entry.on('end', function() {
            var buffer = Buffer.concat(bufs);
            var out = bplist.parseBuffer(buffer);
            if (out.length) {
              out = out.shift();
            }
            done(null, {
              name: out['CFBundleName'] || '',
              bundleId: out['CFBundleIdentifier'] || '',
              version: out['CFBundleVersion'] || ''
            });
          });
        } else {
          entry.autodrain();
        }
      });
  }
}

function setManifestContent(content) {
  manifestTemplate = content;
}

exports = module.exports = manifest;