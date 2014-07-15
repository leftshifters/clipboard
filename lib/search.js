'use strict';

var debug = require('debug')('clipboard:search');
var elasticsearch = require('elasticsearch');
var async = require('async');

var index = 'clipboard';
var type = 'uploads';
var es = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'error'
});

// Ping at start
es.ping({
  requestTimeout: 1000,
  hello: 'elasticsearch!'
})
.then(function() {
  debug('elasticsearch cluster online');
}, function(err) {
  debug(err);
});

/**
 * Recreate indexes for provided items
 */
function reindex(items, done) {

  async.each(items, each, onComplete);

  function each(item, callback) {
    es.create({
      index: index,
      type: type,
      id: item._id.toString(),
      body: {
        name: item.name,
        originalName: item.originalName,
        // remove the '.' from extension before indexing
        type: item.extension.slice(1)
      }
    }).then(function() {
      callback(null);
    }, function(err) {
      callback(err);
    });
  }

  function onComplete(err) {
    if (err) return done(err);
    done(null);
  }

}

/**
 * Drop the whole database
 */
function deleteIndex(done) {

  es.indices.exists({
    index: index
  }).then(function(res) {
    debug('index %s exists', index, res);
    if (!res) return done(null, true);

    es.indices.delete({
      index: index
    }).then(function() {
      debug('deleted index');
      done(null, true);
    }, function(err) {
      done(err);
    });

  }, function(err) {
    debug(err);
    done(err);
  });
}

/**
 * Add a document to the search index
 */
function add(item) {

  es.create({
    index: index,
    type: type,
    id: item._id.toString(),
    body: {
      originalName: item.originalName,
      name: item.name,
      type: item.extension.slice(1)
    }
  }, function(err, response) {
    if(err) {
      return debug(err);
    }
    debug('added item (id: %s, name: %s) to index', item._id, item.name);
  });

}

/**
 * Update a document in the search index
 */
function update(item) {
  es.update({
    index: index,
    type: type,
    id: item.id,
    body: {
      doc: {
        name: item.name
      }
    }
  }, function(err, response) {
    if (err) {
      return debug(err);
    }
    debug('update item (id: %s) in index', item.id);
  });
}

/**
 * Delete a document from the search index
 */
function remove(id) {
  es.delete({
    index: index,
    type: type,
    id: id
  }, function(err, response) {
    if (err) {
      return debug(err);
    }
    debug('removed item (id: %s) from index', id);
  });
}

/**
 * Search items
 */
function search(query, done) {
}

module.exports = exports = {
  add: add,
  update: update,
  remove: remove,
  reindex: reindex,
  deleteIndex: deleteIndex,
  search: search
};