
/*
 * GET home page.
 */

var path = require('path');
var fs = require('fs');
var url = require('url');
var moment = require('moment');
var marked = require('marked');
var debug = require('debug')('clipboard:index');
var _s = require('underscore.string');
var getDb = require('../lib/connect');
var db = require('../lib/db');
var ObjectId = require('mongodb').ObjectID;
var cliputils = require('../lib/cliptils');
var search = require('../lib/search');
var elasticsearch = require('elasticsearch');
// var client = new elasticsearch.Client({
//   host : 'localhost:9200',
// });

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
      debug(err);
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
    next();
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

exports.updateSearchIndex = function(req, res, next) {
  search.update({ id: req.store.id, name: req.store.name });
  next();
};

exports.removeSearchIndex = function(req, res, next) {
  search.remove(req.store.id);
  next();
};

exports.show = function(req, res, next) {
  var html = '<html><head><title>Search</title></head><body>'
  + '<h1>Search Results</h1>'
  + '<form method="post" action="/search">'
  + '<p>Name: <input type="text" name="name" /></p>'
  + '<p>Original Name: <input type="text" name="origName" /></p>'
  + '<p>Type: <input type="text" name="type" /></p>'
  + '<p><input type="submit" value="Search Item" /></p>'
  + '</form></body></html>';
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
};

exports.searchElastic = function(req, res, next) {
  var queryName = req.body.name || '';
  var queryType = req.body.type || '';
  var queryorigName = req.body.origName || '';

  client.search({
    index: 'clipboard',
    type: 'uploads',
    body: {
      query: {
        bool: {
          should: [
            { match: { name: queryName } },
            { match: { type: queryType } },
            { match: { originalName: queryType} }
          ]
        }

      }

    }
  }, function(err, response) {
    if(err) return next(err);


    var hits = response.hits.hits;
    var count = hits.length;
    console.log('number of hits ', count);

    for(var i = 0; i < count; i++) {
      var score = hits[i]._score;
      var originalName = hits[i]._source.originalName || 'not mentioned';
      var name = hits[i]._source.name || 'not mentioned';
      var type = hits[i]._source.type || 'not mentioned';
      console.log('Score is', hits[i]._score, 'and result is ', hits[i]._source);
    }

    res.redirect('/search');

  });

};

exports.reindex = function(req, res) {
  var util = require('util');
  var batchSize = 500;
  var buffer = [];
  var donecount = 0;

  search.deleteIndex(function(err, result) {
    if (err) return res.send(500);
    create();
  });

  function create() {
    db.createItemReadStream(function(err, stream) {
      if (err) {
        debug(err);
        return res.send(500, 'Internal Server Error');
      }

      stream.on('end', function() {
        if (buffer.length) {
          flush(buffer, function() {
            debug('done re-indexing all items');
            res.send(util.format('Re-indexed %d items', donecount));
          });
        }
      });

      stream.on('data', function(data) {
        buffer.push(data);
        if (buffer.length >= batchSize) {
          flush(buffer);
        }
      });

      stream.on('error', function(err) {
        debug(err);
        res.send(500);
      });

      function flush(data, done) {
        debug('re-indexing %d items', data.length);
        stream.pause();
        search.reindex(data, function(err) {
          if (err) return res.send(500);
          stream.resume();
          donecount += buffer.length;
          buffer.length = 0;
          if (done) done();
        });
      }

    });

  }

};

exports.root = function(req, res, next) {
  if (req.xhr)   {
    res.json(req.store.item);
  } else {
    res.redirect('/');
  }
};

exports.ok = function(req, res) {
  res.send(200);
};