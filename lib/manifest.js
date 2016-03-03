var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var getBaseurl = require('./baseurl').get;
var manifestTemplate;

function setManifestContent(content) {
  manifestTemplate = content;
}

fs.readFile(path.join(process.cwd(), 'data/manifest.tpl'), { encoding: 'utf8' }, function(err, filecontent) {
  if (err) {
    throw err;
  }
  setManifestContent(filecontent);
});

function manifest(uploadPath, item, done) {
  var ipaMetadata = require('ipa-metadata');
  var baseurl = getBaseurl();
  var basename = path.basename(item.basename, '.ipa');
  var plistfile = basename + '.plist';
  var url = baseurl + '/' + item.relativePathShort;
  var toExtract = path.join(uploadPath, item.basename);

  ipaMetadata(toExtract, function(err, data) {
    if(err) {
      return done(err);
    }

    if(
      !data.metadata ||
      (
        !data.metadata.CFBundleName ||
        !data.metadata.CFBundleIdentifier ||
        !data.metadata.CFBundleVersion
      )
    ) {
      done(new Error('Invalid IPA.'));
    }

    var pkg = {
      url: url,
      name: data.metadata.CFBundleName,
      bundleId: data.metadata.CFBundleIdentifier,
      version: data.metadata.CFBundleVersion
    };
    var manifest = _.template(manifestTemplate, pkg); // eslint-disable-line no-shadow

    fs.writeFile(path.join(uploadPath, plistfile), manifest, function(err) { // eslint-disable-line no-shadow
      if (err) {
        return console.error(err);
      }
      done(null, item);
    });
  });
}

exports = module.exports = manifest;
