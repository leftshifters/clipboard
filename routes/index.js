
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
      }

      // console.log(items);

      res.render('index', { title: 'Leftload', items: items, baseurl: baseurl });
    });

  });



};