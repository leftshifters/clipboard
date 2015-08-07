import http from 'superagent';

export default {
  getClips() {
    return new Promise((resolve, reject) => {
      http
        .get('api/clips')
        .accept('application/json')
        .end((err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        });
    });
  }
};
