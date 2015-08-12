import http from 'superagent';
let db = null;

if(!db) {
  db = new window.Dexie('clipboard');

  db.version(1).stores({
    clips: '++id,hash,basename,basenameWithoutExt,extension,originalName,relativePathShort,relativePathLong,relativeThumbPathShort,relativeThumbPathLong,mime,name,type,bundleId,created,createdms,url,detailUrl,timeago'
  });

  db.open();
}

export default {
  getClips() {
    return new Promise((resolve, reject) => {
      db.on('ready', () => {
        return db.clips.count((count) => {
          if (count > 0) {
            console.log('fetching from store');
            db.clips
              .toArray()
              .then((clips) => {
                console.log(clips);
                return resolve({'clips': clips});
              });
          } else {
            http
            .get('api/clips')
            .accept('application/json')
            .end((err, res) => {
              if (err) {
                return reject(err);
              }

              if(res.status !== 200) {
                return reject(new Error('Internal server error'));
              }

              let data = res.body.data;
              let clips = db.transaction('rw', db.clips, () => {
                data.items.forEach((clip) => {
                  db.clips.add(clip);
                });
              });

              return resolve({'clips': clips});
            });
          }
        });
      });
    });
  },

  changeTitle(id) {
    return new Promise((resolve, reject) => {
      http
        .post('api/clip/' + id)
        .accept('application/json')
        .end((err, res) => {
          if(err) {
            return reject(err);
          }

          if(res.status !== 200) {
            return reject(new Error('Internal server error'));
          }

          let data = res.body.data;
          return resolve(data);
        });
    });
  }
};
