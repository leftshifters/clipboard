import http from 'superagent';
import debug from 'debug';
let dbg = debug('clipboard:baseutil');

export default {
  get(api) {
      dbg('Get AJAX Invoked with API %s', api);
      return new Promise((resolve, reject) => {
        http
          .get(api)
          .accept('application/json')
          .end((err, res) => {
            if (err) {
              dbg('API %s return with error %o', api, err);
              return reject(err);
            }

            if (res.status !== 200) {
              dbg('Return error as status is not 200');
              return reject(new Error('Internal server error'));
            }

            dbg('Got data!!');
            return resolve({
              'data': res.body.data
            });
          });
      });
    },

    post(api, postParams) {
      dbg('POST AJAX Invoked with API %s and post params %o', api, postParams);
      return new Promise((resolve, reject) => {
        http
          .post(api)
          .accept('application/json')
          .send(postParams)
          .end((err, res) => {
            if (err) {
              return reject(err);
            }

            if (res.status !== 200) {
              return reject(new Error('Internal server error'));
            }

            return resolve({
              'data': res.body.data
            });
          });
      });
    },

    delete(api) {
      dbg('DELETE AJAX Invoked with API %s', api);
      return new Promise((resolve, reject) => {
        http
          .del(api)
          .end((err, res) => {
            if (err) {
              return reject(err);
            }

            if (res.status !== 200) {
              return reject(new Error('Internal server error'));
            }

            return resolve();
          });
      });
    }
};
