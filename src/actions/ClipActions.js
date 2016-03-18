import debug from 'debug';
import {SET_CLIPS,
  SET_CLIP,
  DELETE_CLIP,
  UPLOADING_CLIP,
  UPLOADED} from '../constants/ClipConstants'; // eslint-disable-line no-unused-vars
import {SET_PAGINATION, GOT_ERROR, GOT_SUCCESS} from '../constants/AppConstants';
import Dispatcher from '../core/Dispatcher';
import apiUtils from '../utils/apiUtils';

const log = debug('clipboard:clipaction');

export default {
  getClips(page) {
    apiUtils.getClips(page)
      .then((res) => {
        console.log('Got clips in actions %o', res);
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
        Dispatcher.dispatch({
          actionType: GOT_ERROR,
          payload: {
            error: err
          }
        });
      });
  },

  getClip(hash, name) {
    log('Get clip initialized');
    apiUtils.getClip(hash, name)
      .then((res) => {
        log('Got clip in actions %o', res);
        Dispatcher.dispatch({
          actionType: SET_CLIP,
          payload: res
        });
      })
      .catch((err) => {
        Dispatcher.dispatch({
          actionType: GOT_ERROR,
          payload: {
            error: err
          }
        });
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
        Dispatcher.dispatch({
          actionType: GOT_ERROR,
          payload: {
            error: err
          }
        });
      });
  },

  changeTitle(id, title, pKey) {
    log('Change title action invoked');
    apiUtils.changeTitle(id, title, pKey)
      .then(() => {
        Dispatcher.dispatch({
          actionType: GOT_SUCCESS,
          payload: {
            success: 'Changed title successfully'
          }
        });
      })
      .catch((err) => {
        Dispatcher.dispatch({
          actionType: GOT_ERROR,
          payload: {
            error: err
          }
        });
      });
  },

  deleteClip(id, page) {
    apiUtils.deleteClip(id, page)
    .then((res) => {
      log('Got response after deleting clips %o', res);
      Dispatcher.dispatch({
        actionType: DELETE_CLIP,
        payload: res
      });
    })
    .catch((err) => {
      Dispatcher.dispatch({
        actionType: GOT_ERROR,
        payload: {
          error: err
        }
      });
    });
  },

  addClip(clip, data) {
    log('Got clip on actions %o', data);
    apiUtils
      .tempClip(clip)
      .then((res) => {
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
            Dispatcher.dispatch({
              actionType: GOT_ERROR,
              payload: {
                error: err
              }
            });

            apiUtils
              .deleteTmpClip(res.clip.id)
              .then((delres) => {
                Dispatcher.dispatch({
                  actionType: DELETE_CLIP,
                  payload: delres
                });
              });
          });
      })
      .catch((err) => {
        Dispatcher.dispatch({
          actionType: GOT_ERROR,
          payload: {
            error: err
          }
        });
      });

    Dispatcher.dispatch({
      actionType: UPLOADING_CLIP,
      payload: {
        clip: clip
      }
    });
  }
};
