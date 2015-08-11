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

          if(res.status !== 200) {
            return reject(new Error('Internal server error'));
          }

          let data = res.body.data;
          return resolve(data);
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
