
/*
 * GET home page.
 */

var getDb = require('../lib/connect');

exports.index = function(req, res) {

  getDb(function(err, db) {

    db.collection('uploads').find().sort({ createdms: -1 }).toArray(function(err, items) {
      if (err) return res.send(500);
      var baseurl = req.protocol + '://' + req.headers.host;

      for(var i = 0, len = items.length; i < len; ++i) {
        items[i].url = baseurl + '/' + items[i].relativePathShort;

        if(items[i].type === 'ipa') {
          items[i].url = ipaurl(items[i], baseurl);
        }
      }

      res.render('index', { title: 'Leftload', items: items, baseurl: baseurl });
    });

  });

};


function ipaurl(item, baseurl) {
  console.log(item);
  return 'itms-services://?action=download-manifest&url='
          + baseurl
          + '/uploads/'
          + item.basenameWithoutExt
          + '.plist';
}