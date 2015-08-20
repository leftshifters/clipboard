import apiUtils from '../utils/apiUtils';
import Dispatcher from '../core/Dispatcher';
import {SET_CLIPS, CHANGE_TITLE, DELETE_CLIP} from '../constants/ClipConstants';
import debug from 'debug';
let dbg = debug('clipboard:clipaction');

export default {
  getClips() {
    apiUtils.getClips()
      .then((res) => {
        dbg('Got clips in actions %o', res);
        Dispatcher.dispatch({
          actionType: SET_CLIPS,
          payload: {
            clips: res.clips
          }
        });
      })
      .catch((err) => {
        if (err.status === 401) {
          dbg('Error is %o', err);
        }
      });
  },

  changeTitle(id, title, pKey) {
    dbg('Change title action invoked');
    apiUtils.changeTitle(id, title, pKey)
      .then((res) => {
        Dispatcher.dispatch({
          actionType: CHANGE_TITLE,
          payload: {
            clip: res.clips
          }
        });
      })
      .catch((err) => {
        dbg('Error is %o', err);
      });
  },

  deleteClip(id, pKey) {
    apiUtils.deleteClip(id, pKey)
    .then((res) => {
      dbg('Got response after deleting clips %o', res);
      Dispatcher.dispatch({
        actionType: DELETE_CLIP,
        payload: res.clips
      });
    })
    .catch((err) => {
      dbg('Error is %o', err);
    });
  }
};
