var baseurl = '';

function set(scheme, host) {
  if (scheme && host) {
    baseurl = [scheme, '://', host].join('');
  }

  return baseurl;
}

function get() {
  if (baseurl) {
    return baseurl;
  } else {
    throw new Error('baseurl not set');
  }
}

exports = module.exports = { set: set, get: get };