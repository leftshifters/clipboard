import debug from 'debug';
import http from 'superagent';

const log = debug('clipboard:baseutil');

export default {
  get(api) {
      return new Promise((resolve, reject) => {
        http
          .get(api)
          .accept('application/json')
          .end((err, res) => {
            if (err) {
              log('GET-ERROR >> %s >> %o', api, err);
              return reject(err);
            }

            if (res.status !== 200) {
              log('GET-REJECTED >> %s >> %o', api, res);
              return reject(new Error('Internal server error'));
            }

            log('GET >> %s >> %o >> %s', api, res.body.data, res.status);
            return resolve({
              'data': res.body.data
            });
          });
      });
    },

    post(api, postParams) {
      return new Promise((resolve, reject) => {
        http
          .post(api)
          .accept('application/json')
          .send(postParams)
          .end((err, res) => {
            if (err) {
              log('POST-ERROR >> %s >> %o', api, err);
              return reject(err);
            }

            if (res.status !== 200) {
              log('POST-REJECTED >> %s >> %o', api, res);
              return reject(new Error('Internal server error'));
            }

            log('POST >> %s >> %o >> %s', api, res.body.data, res.status);
            return resolve({
              'data': res.body.data
            });
          });
      });
    },

    delete(api) {
      return new Promise((resolve, reject) => {
        http
          .del(api)
          .end((err, res) => {
            if (err) {
              log('DELETE-ERROR >> %s >> %o', api, err);
              return reject(err);
            }

            if (res.status !== 200) {
              log('DELETE-REJECTED >> %s >> %o', api, res);
              return reject(new Error('Internal server error'));
            }

            return resolve();
          });
      });
    }
};
