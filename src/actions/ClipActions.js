import apiUtils from '../utils/apiUtils';
import Dispatcher from '../core/Dispatcher';
import {CHANGE_TITLE} from '../constants/ClipConstants';
import debug from 'debug';
let dbg = debug('clipboard:clipaction');

export default {
  changeTitle(id, title, pKey) {
    dbg('Change title action invoked');
    apiUtils.changeTitle(id, title, pKey)
      .then((res) => {
        Dispatcher.dispatch({
          actionType: CHANGE_TITLE,
          payload: {
            clip: res.clip
          }
        });
      })
      .catch((err) => {
        dbg('Error is %o', err);
      });
  }
};
