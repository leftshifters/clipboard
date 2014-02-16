var getDb = require('./connect');
var Hashids = require('hashids');
var hash = new Hashids('', 5);

exports.insertItem = function(item, done) {

  getDb(function(err, db) {
    if (err) return done(err);
    var itemsCollection = db.collection('uploads');

    itemsCollection.count(function count(err, count) {
      if (err) return done(err);

      item.hash = hash.encrypt(count);

      itemsCollection.insert(item, function(err, results) {
        if (err) return done(err);

        done(null, results);
      });

    });
  });
};