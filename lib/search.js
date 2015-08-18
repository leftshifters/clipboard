var debug = require('debug')('clipboard:search');
var elasticsearch = require('elasticsearch');
var async = require('async');

var index = 'clipboard';
var type = 'uploads';
var host = process.env.ELASTICSEARCH_HOST || '127.0.0.1';
var port = process.env.ELASTICSEARCH_PORT || '9200';
var loglevel = process.env.ELASTICSEARCH_LOG_LEVEL || 'error';
var size = 19;

var es = new elasticsearch.Client({
  host: host + ':' + port,
  log: loglevel
});

// Ping at start
// es.ping({
//   requestTimeout: 1000,
//   hello: 'elasticsearch!'
// })
// .then(function() {
//   debug('elasticsearch cluster online');
// }, function(err) {
//   debug(err);
//   process.exit(1);
// });

/**
 * Recreate indexes for provided items
 */
function reindex(items, done) {

  function each(item, callback) {
    es.create({
      index: index,
      type: type,
      id: item._id.toString(), // eslint-disable-line no-underscore-dangle
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
    if (err) {
      return done(err);
    }

    done(null);
  }

  async.each(items, each, onComplete);
}

/**
 * Drop the whole database
 */
function deleteIndex(done) {

  es.indices.exists({
    index: index
  }).then(function(res) {
    debug('index %s exists', index, res);
    if (!res) {
      return done(null, true);
    }

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
    id: item._id.toString(), // eslint-disable-line no-underscore-dangle
    body: {
      originalName: item.originalName,
      name: item.name,
      type: item.extension.slice(1)
    }
  }, function(err) {
    if(err) {
      return debug(err);
    }
    debug('added item (id: %s, name: %s) to index', item._id, item.name); // eslint-disable-line no-underscore-dangle
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
  }, function(err) {
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
  }, function(err) {
    if (err) {
      return debug(err);
    }
    debug('removed item (id: %s) from index', id);
  });
}

/**
 * Search items
 */
function search(page, query, done) {
  function onSearch(err, response) {
    if (err) {
      debug(err);
      return done(err);
    }

    var more = response.hits.total - (response.hits.hits.length + (page * size)) > 0;
    var results = response.hits.hits.map(function(item) {
      return item._id; // eslint-disable-line no-underscore-dangle
    }) || [];

    debug('%d items found of %d total for %s', response.hits.hits.length, response.hits.total, query);
    debug('search page', page + 1);
    debug('more available', more);

    done(null, results, more);
  }

  es.search({
    index: index,
    type: type,
    size: size,
    from: page * size,
    body: {
      query: {
        multi_match: { // eslint-disable-line camelcase
          query: query,
          fields: [ 'name', 'originalName', 'type' ],
          type: 'phrase_prefix',
          tie_breaker: 0.3 // eslint-disable-line camelcase
        }
      }
    }
  }, onSearch);
}

module.exports = exports = {
  add: add,
  update: update,
  remove: remove,
  reindex: reindex,
  deleteIndex: deleteIndex,
  search: search
};
