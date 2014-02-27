
/*
 * GET home page.
 */

var getDb = require('../lib/connect');

exports.index = function(req, res) {

  getDb(function(err, db) {

    db.collection('uploads').find().sort({ createdms: -1 }).toArray(function(err, items) {
      if (err) return res.send(500);
      var baseurl = req.protocol + '://' + req.headers.host;

      for (var i = 0, len = items.length; i < len; ++i) {
        items[i].url = baseurl + '/' + items[i].relativePathShort;


        if (items[i].type === 'ipa') {
          items[i].url = ipaurl(items[i], baseurl);
        }

        if (items[i].type === 'image') {
          items[i].imageurl = '../' + items[i].relativePathShort;
        }

        type(items[i]);
        setname(items[i]);
      }

      res.render('index', { title: 'Leftload', items: items, baseurl: baseurl });
    });

  });

};


function ipaurl(item, baseurl) {
  return 'itms-services://?action=download-manifest&url='
          + baseurl
          + '/uploads/'
          + item.basenameWithoutExt
          + '.plist';
}

function type(item) {
  item.type = item.type || item.extension || 'file';

  if ('.' === item.type[0]) {
    item.type = item.type.slice(1);
  }
}

function setname(item) {
  if ('untitled' === item.name) {
    item.name = item.originalName;
  }
}