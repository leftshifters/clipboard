var getDb = require('./connect');
var Hashids = require('hashids');
var ObjectId = require('mongodb').ObjectID;
var hash = new Hashids('', 5);
var limit = 20;
var skip = 0;

exports.insertItem = function(item, done) {

  getDb(function(err, db) {
    if (err) {
      return done(err);
    }

    var itemsCollection = db.collection('uploads');

    itemsCollection.count(function count(err, count) { // eslint-disable-line no-shadow
      if (err) {
        return done(err);
      }

      item.hash = hash.encrypt(count);

      itemsCollection.insert(item, function(err, results) { // eslint-disable-line no-shadow
        if (err) {
          return done(err);
        }

        done(null, results);
      });

    });
  });
};

exports.createItemReadStream = function(done) {
  getDb(function(err, db) {
    if (err) {
      return done(err);
    }

    var items = db.collection('uploads');

    done(null, items.find().stream());
  });
};

exports.fetchItemByHash = function(hash, done) { // eslint-disable-line no-shadow
  getDb(function(err, db) {
    if (err) {
      return done(err);
    }

    db.collection('uploads')
      .findAndModify({
          basenameWithoutExt: hash
        },
        null, {
          '$inc': {
            downloaded: 1
          }
        }, {
          'new': true
        },
        done
      );
  });
};

exports.fetchItems = function(page, done) {
  if (typeof page === 'function') {
    done = page;
  }

  getDb(function(err, db) {
    if (err) {
      return done(err);
    }

    db.collection('uploads')
      .find(null, null, {
        limit: limit + 1,
        skip: page * limit,
        sort: [
          ['createdms', 'desc']
        ]
      })
      .toArray(function(err, items) { // eslint-disable-line no-shadow
        if (err) {
          return done(err);
        }

        var more = !!items[limit];
        if (more) {
          items.splice(items.length - 1);
        }

        done(null, items, more);
      });
  });

};

exports.fetchByIds = function(ids, done) {
  getDb(function(err, db) {
    if (err) {
      return done(err);
    }

    ids = ids.map(ObjectId);

    db.collection('uploads')
      .find({
        _id: {
          '$in': ids
        }
      }, null, {
        sort: [
          ['createdms', 'desc']
        ]
      })
      .toArray(function(err, items) { // eslint-disable-line no-shadow
        if (err) {
          return done(err);
        }
        done(null, items);
      });
  });
};

exports.count = function(collection, done) {
  getDb(function(err, db) {
    if (err) {
      return done(err);
    }
    db.collection(collection)
      .count(function(err, count) { // eslint-disable-line no-shadow
        if (err) {
          return done(err);
        }
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
