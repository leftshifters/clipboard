
/*
 * GET home page.
 */

var path = require('path');
var fs = require('fs');
var url = require('url');
var moment = require('moment');
var marked = require('marked');
var _s = require('underscore.string');
var getDb = require('../lib/connect');
var db = require('../lib/db');
var ObjectId = require('mongodb').ObjectID;
var cliputils = require('../lib/cliptils');

exports.index = function(req, res) {
  var page = req.store.page || 0;

  db.fetchItems(page, function(err, items, more) {
    if (err) return res.send(500);
    var baseurl = req.protocol + '://' + req.headers.host;

    for (var i = 0, len = items.length; i < len; ++i) {
      cliputils.seturl(items[i], baseurl);

      if (items[i].type === 'ipa') {
        items[i].url = cliputils.ipaurl(items[i], baseurl);
      }

      if (items[i].type === 'image') {
        items[i].imageurl = '../' + items[i].relativePathShort;
      }

      cliputils.type(items[i]);
      cliputils.setname(items[i]);
      cliputils.settimeago(items[i]);
    }

    res.render('index', {
      title: 'Clipboard',
      items: items,
      baseurl: baseurl,
      page: page,
      more: more,
      leftArrow: !!page > 0 ? '' : 'invisible',
      rightArrow: more ? '' : 'invisible'
    });
  });

};

exports.detail = function(req, res, next) {
  var item = req.store.item;
  console.log(item);
  var baseurl = req.protocol + '://' + req.headers.host;
  var nameslug = _s.slugify(item.name);

  item.url = url.resolve(baseurl, item.relativePathShort);
  item.downloadUrl = url.resolve(baseurl, ['clip', item.basenameWithoutExt, nameslug].join('/'));
  item.added = moment(item.createdms).format('MMM Do YY');
  item.buttonText = 'Download';

  // Set ipa download url
  if ('ipa' === item.type) {
    item.installUrl = cliputils.ipaurl(item, baseurl);
    item.buttonText = 'Download IPA';
  }

  if ('apk' === item.type) {
    item.installUrl = item.downloadUrl;
    item.buttonText = 'Download APK';
  }

  res.render('detail', { title: item.name, item: item });
};

exports.changelog = function(req, res) {
  fs.readFile('CHANGELOG.md', { encoding: 'utf8' }, function(err, data) {
    if (err) {
      console.error(err);
      res.send(500);
    }

    res.render('changelog', { title: 'Changelog', html: marked(data) });
  });
};

exports.detectify = function(req, res) {
  res.send('detectify');
};

exports.page = function(req, res, next) {
  var page = parseInt(req.params.page, 10);

  if (page > 0) {
    page = page - 1;
  }

  req.store.page = page || 0;
  next();
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

          cliputils.removeFiles(toremove, function(err) {
            if (err) return res.send(500);
            next();
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

exports.root = function(req, res, next) {
  if (req.xhr) {
    res.json(req.store.item);
  } else {
    res.redirect('/');
  }
};

exports.ok = function(req, res, next) {
  res.send(200);
};