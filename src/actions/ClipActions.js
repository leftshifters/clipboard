import debug from 'debug';
import {SET_CLIPS, CHANGE_TITLE, DELETE_CLIP, UPLOADING_CLIP, UPLOADED} from '../constants/ClipConstants'; // eslint-disable-line no-unused-vars
import {SET_PAGINATION} from '../constants/AppConstants';
import Dispatcher from '../core/Dispatcher';
import apiUtils from '../utils/apiUtils';
const log = debug('clipboard:clipaction');

export default {
  getClips(page) {
    apiUtils.getClips(page)
      .then((res) => {
        log('Got clips in actions %o', res);
        Dispatcher.dispatch({
          actionType: SET_CLIPS,
          payload: {
            clips: res.clips
          }
        });

        Dispatcher.dispatch({
          actionType: SET_PAGINATION,
          payload: {
            pages: res.pages
          }
        });
      })
      .catch((err) => {
        if (err.status === 401) {
          log('Error is %o', err);
        }
      });
  },

  searchClips(page) {
    apiUtils.searchClips(page)
      .then((res) => {
        log('Got clips in actions %o', res);
        Dispatcher.dispatch({
          actionType: SET_CLIPS,
          payload: {
            clips: res.clips
          }
        });

        Dispatcher.dispatch({
          actionType: SET_PAGINATION,
          payload: {
            pages: res.pages
          }
        });
      })
      .catch((err) => {
        if (err.status === 401) {
          log('Error is %o', err);
        }
      });
  },

  changeTitle(id, title, pKey) {
    log('Change title action invoked');
    apiUtils.changeTitle(id, title, pKey)
      .then(() => {
        log('Title change');
      })
      .catch((err) => {
        log('Error is %o', err);
      });
  },

  deleteClip(id, pKey) {
    apiUtils.deleteClip(id, pKey)
    .then((res) => {
      log('Got response after deleting clips %o', res);
      Dispatcher.dispatch({
        actionType: DELETE_CLIP,
        payload: res
      });
    })
    .catch((err) => {
      log('Error is %o', err);
    });
  },

  addClip(clip, data) {
    log('Got clip on actions %o', data);
    apiUtils
      .tempClip(clip)
      .then((res) => {
        Dispatcher.dispatch({
          actionType: UPLOADING_CLIP,
          payload: res
        });

        apiUtils
          .addClip(res.clip, data)
          .then((newres) => {
            log('Got uploaded response in clip actions %o', newres);
            Dispatcher.dispatch({
              actionType: UPLOADED,
              payload: newres
            });
          })
          .catch((err) => {
            log('Got uploaded err in clip actions %o', err);
          });
      })
      .catch((err) => {
        log('Got uploaded err in clip actions %o', err);
      });

    Dispatcher.dispatch({
      actionType: UPLOADING_CLIP,
      payload: {
        clip: clip
      }
    });
  }
};
