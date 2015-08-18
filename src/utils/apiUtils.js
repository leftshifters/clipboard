// import Dexie from 'dexie';
import basicUtils from './basicUtils';
import debug from 'debug';

let db = null;
let dbg = debug('clipboard:apiutil');

if(!db || window.indexedDB) {
  dbg('Initializing indexDB');
  db = new window.Dexie('clipboard');

  db.version(1).stores({
    clips: '++id,hash,basename,basenameWithoutExt,extension,originalName,relativePathShort,relativePathLong,relativeThumbPathShort,relativeThumbPathLong,mime,name,type,bundleId,created,createdms,url,detailUrl,timeago'
  });

  db.open();
}

export default {
  // Do Ajax;
  _fetch(reject, resolve) {
    basicUtils
    .get('api/clips')
    .then((res) => {
      if(!db) {
        return resolve({'clips': res.data.items});
      }

      let clips = db.transaction('rw', db.clips, () => {
        res.data.items.forEach((clip) => {
          db.clips.add(clip);
        });
      });

      return resolve({'clips': clips});
    })
    .error((err) => {
      return reject(err);
    });
  },

  getClips() {
    return new Promise((resolve, reject) => {
      if(!db) {
        return this._fetch(resolve, reject); // eslint-disable-line no-underscore-dangle
      }

      dbg('Fetching records from IndexDB');
      db.on('ready', () => {
        return db.clips.count((count) => {
          if (count > 0) {
            dbg('Records count is %s', count);
            db.clips
              .toArray()
              .then((clips) => {
                dbg('Got clips %o ', clips);
                return resolve({'clips': clips});
              });
          } else {
            return this._fetch(resolve, reject); // eslint-disable-line no-underscore-dangle
          }
        });
      });
    });
  },

  changeTitle(id, title, pkey) {
    dbg('Got Id : %s and title %o and pKey %s', id, title, pkey);
    return new Promise((resolve, reject) => {
      basicUtils
      .post('api/clip/' + id, title)
      .then((res) => {
        if(!db) {
          return resolve(res);
        }

        db.clips
        .update(parseInt(pkey, 10), title)
        .then((updated) => {
          dbg('Updated value is %o', updated);
          if(updated > 0) {
            dbg('Updated clip title successfully: %o', title);
          } else {
            dbg('Error while updating title in IndexDB: %o', title);
          }

          db.clips
          .toArray()
          .then((clips) => {
            dbg('Got clips %o ', clips);
            return resolve({'clips': clips});
          });
        });
      })
      .catch((err) => {
        return reject(err);
      });
    });
  },

  deleteClip(id, pKey) {
    return new Promise((resolve, reject) => {
      basicUtils
      .delete('api/clip/' + id)
      .then((res) => {
        if(!db) {
          return resolve(res);
        }

        db.clips
        .delete(parseInt(pKey))
        .then(() => {
          dbg('Deleted clip with index %s', pKey);
          db.clips
          .toArray()
          .then((clips) => {
            dbg('Got clips %o ', clips);
            return resolve({'clips': clips});
          });
        })
        .catch((err) => {
          return reject(err);
        });
      });
    });
  }
};
