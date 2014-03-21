var getDb = require('./connect');
var Hashids = require('hashids');
var hash = new Hashids('', 5);
var limit = 19;
var skip = 0;
var upsertnew = { "new": true, upsert: true };

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

exports.fetchItemByHash = function(hash, done) {
  getDb(function(err, db) {
    if (err) return done(err);

    db.collection('uploads')
      .findAndModify(
        { basenameWithoutExt: hash },
        null,
        { "$inc": { downloaded: 1 }},
        { "new": true },
        done
      );
  });
};

exports.fetchItems = function(page, done) {
  if ('function' === typeof page) {
    done = page;
  }

  getDb(function(err, db) {
    if (err) return done(err);

    db.collection('uploads')
      .find(null, null, {
        limit: limit + 1,
        skip: page * limit,
        sort: [['createdms', 'desc']]
      })
      .toArray(function(err, items) {
        if (err) return done(err);

        var more = !!items[limit];
        if (more) {
          items.splice(items.length - 1);
        }

        done(null, items, more);
      });
  });

};

exports.count = function(collection, done) {
  getDb(function(err, db) {
    if (err) return done(err);
    db.collection(collection)
      .count(function(err, count) {
        if (err) return done(err);
        done(null, count);
      });
  });
};

exports.setLimit = function(newLimit) {
  limit = newLimit || limit;
};

exports.setSkip = function(newSkip) {
  skip = newSkip || skip;
};

exports.getLimit = function() {
  return limit;
};

exports.getSkip = function() {
  return skip;
};