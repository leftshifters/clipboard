import debug from 'debug';
import _ from 'lodash';
import basicUtils from './basicUtils';

const isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
const log = debug('clipboard:apiutil');
let db = null;

if(!isSafari && (!db || window.indexedDB)) {
  log('Initializing indexDB');
  db = new window.Dexie('clipboard');

  db.version(1).stores({
    clips: '++id,page,hash,basename,basenameWithoutExt,extension,originalName,height,width,relativePathShort,relativePathLong,relativeThumbPathShort,relativeThumbPathLong,mime,name,type,bundleId,created,createdms,url,detailUrl,timeago,downloaded,[hash+name]',
    pages: '++id,leftArrow,more,nextPageLink,page,prevPageLink,query,rightArrow,searchBtn,searchIcon'
  });

  db.open();
}

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
    // if(db) {
    //   db.open();
    //   db.on('error', function(e) { console.error(e.stack || e); });
    //   db.on('ready', () => {
    //     console.log('Got page %s', p);
    //     return db
    //       .clips
    //       .where('page')
    //       .equals(p)
    //       .count((count) => {
    //         log('Count %s', count);
    //         log('Records count is %s', count);
    //         if(count > 0) {
    //           cb(null);
    //         } else {
    //           basicUtils
    //             .get(url)
    //             .then((res) => {
    //               log('Base utils promised resolve %o', res);
    //               if(res.error) {
    //                 return cb(res.error);
    //               }
    //
    //               cb(null, res.data);
    //             })
    //             .catch((err) => {
    //               cb(err);
    //             });
    //         }
    //       });
    //   });
    // } else {
    //   basicUtils
    //     .get(url)
    //     .then((res) => {
    //       log('Base utils promised resolve %o', res);
    //       if(res.error) {
    //         return cb(res.error);
    //       }
    //
    //       cb(null, res.data);
    //     })
    //     .catch((err) => {
    //       cb(err);
    //     });
    // }
  },

  getClips(p) {
    if(!p) {
      p = 1;
    }

    let url = `/api/clips/${p}`;

    return new Promise((resolve, reject) => {
      if(!db) {
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
      } else {
        log('Fetching records from IndexDB');
        this._fetch(url, p, (err, fetched) => { // eslint-disable-line no-underscore-dangle
          if(err) {
            return reject(err);
          }

          if(!fetched) {
            db.clips
              .toArray()
              .then((clips) => {
                log('sort and reverse array!! This should be handeled by indexDB');
                clips = _.sortBy(clips, 'createdms').reverse();
                log('Fetched array from store %o', clips);
                db.pages
                  .toArray()
                  .then((pages) => {
                    return resolve({
                      'pages': pages,
                      'clips': clips
                    });
                  });
              });
          } else {
            db.open();
            db.on('ready', () => {
              db.transaction('rw', db.clips, db.pages, () => {
                log('fetched data is %o', fetched);
                db.clips.clear();
                db.pages.clear();

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

                log('Paginate is %o', page);
                db.pages.add(page);
                fetched.items.forEach(function (item) {
                  log('Adding object: %o', item);
                  item.page = fetched.page + 1;
                  db.clips.add(item);
                });
              })
              .then(() => {
                db.clips
                  .toArray()
                  .then((clips) => {
                    log('Fetched array from store %o', clips);
                    db.pages
                      .toArray()
                      .then((pages) => {
                        return resolve({
                          'pages': pages,
                          'clips': clips
                        });
                      });
                  });
              });
            });
          }
        });
      }
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

        if(!db) {
          return resolve(res);
        }

        db.clips
        .update(parseInt(pkey, 10), title)
        .then((updated) => {
          log('Updated value is %o', updated);
          if(updated > 0) {
            log('Updated clip title successfully: %o', title);
          } else {
            log('Error while updating title in IndexDB: %o', title);
          }

          db.clips
          .toArray()
          .then((clips) => {
            log('Got clips %o ', clips);
            return resolve({'clips': clips});
          });
        });
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

        if(db) {
          db.clips.clear();
          db.pages.clear();
        }

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

          if(db) {
            db.open();
            db.on('ready', () => {
              db.transaction('rw', db.clips, db.pages, () => {
                log('fetched data is %o', fetched);
                log('Paginate is %o', p);
                db.pages.add(p);
                fetched.items.forEach(function (item) {
                  log('Adding object: %o', item);
                  item.page = fetched.page + 1;
                  db.clips.add(item);
                });
              })
              .then(() => {
                db.clips
                  .toArray()
                  .then((clips) => {
                    log('Fetched array from store %o', clips);
                    db.pages
                      .toArray()
                      .then((pages) => {
                        return resolve({
                          'pages': pages,
                          'clips': clips
                        });
                      });
                  });
              });
            });
          } else {
            resolve({
              pages: p,
              clips: fetched.items
            });
          }
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
      if(db) {
        db.open();
        db.on('ready', () => {
          db.transaction('rw', db.clips, () => {
            db.clips.add(clip).then((id) => {
              clip.id = id;
              log('Temp clip is %o', clip);
              return resolve({
                clip: clip
              });
            });
          });
        });
      } else {
        resolve({
          'clip': clip
        });
      }
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
          let revisedClip = _.merge(clip, res.data);

          if(db) {
            db.clips
              .update(clip.id, revisedClip)
              .then((updated) => {
                log('Updated value is %o', updated);
                if(updated > 0) {
                  log('Updated clip clip successfully: %o', revisedClip);
                } else {
                  log('Error while updating clip in IndexDB: %o', revisedClip);
                }

                db.clips
                  .toArray()
                  .then((clips) => {
                    log('Got clips %o ', clips);
                    clips.unshift(revisedClip);
                    return resolve({'clips': clips});
                  });
              });
          } else {
            let url = '/api/clips/1';
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
          }
        })
        .catch((err) => {
          log('Got error while uplading %o', err);
          reject(err);
        });
    });
  }
};
