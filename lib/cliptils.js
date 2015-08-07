/**
 * Clip Utilities
 */
var _s = require('underscore.string'); // eslint-disable-line no-underscore-dangle
var moment = require('moment');
var fs = require('fs');
var async = require('async');

/**
 * Remove multiple files at once in an async fashion
 *
 * @param {Array} paths
 * @param {Function} done
 */
function removeFiles(paths, done) {
  var tasks = paths.map(function(path) {
    return function(done) { // eslint-disable-line no-shadow
      fs.unlink(path, done);
    };
  });

  async.series(tasks, done);
}

/**
 * Create IPA installation url
 *
 * @param {Object} item
 * @param {String} baseurl
 * @returns {String}
 */
function ipaurl(item, baseurl) {
  return 'itms-services://?action=download-manifest&amp='
          + baseurl
          + '/uploads/'
          + item.basenameWithoutExt
          + '.plist';
}

/**
 * Set item's type
 *
 * @param {Object} item
 */
function type(item) {
  item.type = item.type || item.extension || 'file';

  if (item.type[0] === '.') {
    item.type = item.type.slice(1);
  }
}

/**
 * Set item's name
 *
 * @param {Object} item
 */
function setname(item) {
  if (item.name === 'untitled') {
    item.name = item.originalName;
  }
}

/**
 * Set item's timeago value
 *
 * @param {Object} item
 */
function settimeago(item) {
  item.timeago = moment(item.created).fromNow() || '';
}

/**
 * Set item's download and detail url
 *
 * @param {Object} item
 * @param {String} baseurl
 */
function seturl(item, baseurl) {
  var name = item.name;
  if (item.name === 'untitled') {
    name = item.originalName.substr(0, item.originalName.length - 4);
  }

  item.url = baseurl
            + '/clip/'
            + item.basenameWithoutExt
            + '/'
            + _s.slugify(name || item.originalName);

  item.detailUrl = baseurl
            + '/clipd/'
            + item.basenameWithoutExt
            + '/'
            + _s.slugify(name || item.originalName);
}

exports = module.exports = {
  removeFiles: removeFiles,
  ipaurl: ipaurl,
  type: type,
  setname: setname,
  settimeago: settimeago,
  seturl: seturl
};
