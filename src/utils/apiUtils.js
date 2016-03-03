import debug from 'debug';
import basicUtils from './basicUtils';
const log = debug('clipboard:apiutil');
let db = null;

export default {
  // Do Ajax;
  //
  _fetch(url, p, cb) {
    basicUtils
      .get(url)
      .then((res) => {
        log('Base utils promised resolve %o', res);
        if(res.error) {
          return cb(res.error);
        }

        cb(null, res.data);
      })
      .catch((err) => {
        cb(err);
      });
  },

  getClips(p) {
    if(!p) {
      p = 1;
    }

    let url = `/api/clips/${p}`;

    return new Promise((resolve, reject) => {
      basicUtils
        .get(url)
        .then((res) => {
          if(res.error) {
            return reject(res.error);
          }

          let page = {
            'leftArrow': res.data.leftArrow,
            'more': res.data.more,
            'nextPageLink': res.data.nextPageLink,
            'page': res.data.page,
            'prevPageLink': res.data.prevPageLink,
            'query': res.data.query,
            'rightArrow': res.data.rightArrow,
            'searchBtn': res.data.searchBtn,
            'searchIcon': res.data.searchIcon
          };

          resolve({
            'clips': res.data.items,
            'pages': page
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getClip(hash, name) {
    return new Promise((resolve, reject) => {
      basicUtils.get(`/api/clipd/${hash}/${name}`)
        .then((res) => {
          log('Got data in API %o', res);

          if(res.error) {
            return reject(res.error);
          }

          return resolve({
            clip: res.data
          });
        })
        .catch((err) => {
          log('Got error %o', err);
          return reject(err);
        });
    });
  },

  searchClips(q, p) {
    if(!p) {
      p = 1;
    }

    let url = `/api/clips/${p}?q=${q}`;

    return new Promise((resolve, reject) => {
      basicUtils
        .get(url)
        .then((res) => {
          if(res.error) {
            return reject(res.error);
          }

          let page = {
            'leftArrow': res.data.leftArrow,
            'more': res.data.more,
            'nextPageLink': res.data.nextPageLink,
            'page': res.data.page,
            'prevPageLink': res.data.prevPageLink,
            'query': res.data.query,
            'rightArrow': res.data.rightArrow,
            'searchBtn': res.data.searchBtn,
            'searchIcon': res.data.searchIcon
          };

          return resolve({
            'clips': res.data.items,
            'pages': page
          });

        })
        .catch((err) => {
          return reject(err);
        });
    });
  },

  changeTitle(id, title, pkey) {
    log('Got Id : %s and title %o and pKey %s', id, title, pkey);
    return new Promise((resolve, reject) => {
      basicUtils
      .post('api/clip/' + id, title)
      .then((res) => {

        if(res.error) {
          return reject(res.error);
        }

        return resolve(res);
      })
      .catch((err) => {
        return reject(err);
      });
    });
  },

  deleteClip(id, page) {
    return new Promise((resolve, reject) => {
      basicUtils
      .delete('api/clip/' + id)
      .then((res) => {
        if(res.error) {
          return reject(res.error);
        }

        let url = `/api/clips/${page}`;

        this._fetch(url, page, (err, fetched) => { // eslint-disable-line no-underscore-dangle
          if(err) {
            return reject(err);
          }

          let p = {
            'leftArrow': fetched.leftArrow,
            'more': fetched.more,
            'nextPageLink': fetched.nextPageLink,
            'page': fetched.page,
            'prevPageLink': fetched.prevPageLink,
            'query': fetched.query,
            'rightArrow': fetched.rightArrow,
            'searchBtn': fetched.searchBtn,
            'searchIcon': fetched.searchIcon
          };

          resolve({
            pages: p,
            clips: fetched.items
          });

        });
      });
    });
  },

  deleteTmpClip(pKey) {
    return new Promise((resolve, reject) => {
      db.open();
      db.on('ready', () => {
        db.clips
        .delete(parseInt(pKey))
        .then(() => {
          log('Deleted temp clip with index %s', pKey);
          db.clips
          .toArray()
          .then((clips) => {
            log('Got clips %o ', clips);
            return resolve({clips: clips});
          });
        })
        .catch((err) => {
          return reject(err);
        });
      });
    });
  },

  tempClip(clip) {
    return new Promise((resolve) => {
      resolve({
        'clip': clip
      });
    });
  },

  addClip(clip, data) {
    return new Promise((resolve, reject) => {
      basicUtils
        .upload('/api/clip/upload', data)
        .then((res) => {
          log('Got uplaod response %o', res);
          if(res.error) {
            return reject(res.error);
          }

          clip.uploading = false;
          let url = '/api/clips/1'; // eslint-disable-line no-trailing-spaces
          this._fetch(url, 1, (err, fetched) => { // eslint-disable-line no-underscore-dangle
            if(err) {
              return reject(err);
            }

            let page = {
              'leftArrow': fetched.leftArrow,
              'more': fetched.more,
              'nextPageLink': fetched.nextPageLink,
              'page': fetched.page,
              'prevPageLink': fetched.prevPageLink,
              'query': fetched.query,
              'rightArrow': fetched.rightArrow,
              'searchBtn': fetched.searchBtn,
              'searchIcon': fetched.searchIcon
            };

            resolve({
              pages: page,
              clips: fetched.items
            });
          });
        })
        .catch((err) => {
          log('Got error while uplading %o', err);
          reject(err);
        });
    });
  }
};
