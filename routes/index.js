
/*
 * GET home page.
 */

var path = require('path');
var fs = require('fs');
var async = require('async');
var moment = require('moment');
var getDb = require('../lib/connect');
var ObjectId = require('mongodb').ObjectID;

exports.index = function(req, res) {

  getDb(function(err, db) {

    db.collection('uploads')
      .find()
      .sort({ createdms: -1 })
      .toArray(function(err, items) {
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
          settimeago(items[i]);
        }

      res.render('index', { title: 'Leftload', items: items, baseurl: baseurl });
    });

  });

};

exports.editItem = function(req, res, next) {
  var id = req.store.id;
  var name = req.store.name;

  getDb(function(err, db) {
    if (err) return res.send(500);
    db.collection('uploads')
      .update({ _id: ObjectId(id) }, { "$set": { name: name }}, done)
  });

  function done(err) {
    if (err) return res.send(500);
    res.send(200);
  }
};

exports.deleteItem = function(req, res, next) {
  var id = req.store.id;
  var toremove = [];
  var uploadpath = req.app.get('uploadpath');
  var items;

  getDb(function(err, db) {
    if (err) return res.send(500);
    items = db.collection('uploads');
    items
      .findOne({ _id: ObjectId(id) }, function(err, item) {
        if (err) return next(err);

        toremove.push(path.join(process.cwd(), item.relativePathLong));

        if ('ipa' === item.type) {
          toremove.push(
            path.join(
              process.cwd(),
              uploadpath,
              item.basenameWithoutExt
              + '.plist'));
        }

        items.remove({ _id: ObjectId(id) }, function(err) {
          if (err) return next(err);

          removeFiles(toremove, function(err) {
            if (err) return res.send(500);
            res.send(200);
          });

        });

      });
  });
};

exports.validateId = function(req, res, next) {
  var id = req.params.id;
  id = id && id.trim();
  if (!id) return res.send(400, 'Need item id');

  req.store.id = id;
  next();
};

exports.validateName = function(req, res, next) {
  var name = req.body.name;
  name = name && name.trim();
  if (!name) return res.send(400, 'Need name');

  req.store.name = name;
  next();
};

function removeFiles(paths, done) {
  var tasks = paths.map(function(path) {
    return function(done) {
      fs.unlink(path, done);
    };
  });

  async.series(tasks, done);
}

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

function settimeago(item) {
  item.timeago = moment(item.created).fromNow() || '';
}