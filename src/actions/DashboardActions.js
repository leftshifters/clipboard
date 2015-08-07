import apiUtils from '../utils/apiUtils';
import Dispatcher from '../core/Dispatcher';
import {SET_CLIPS} from '../constants/ClipConstants';

export default {
  getClips() {
    apiUtils.getClips()
      .then((res) => {
        Dispatcher.dispatch({
          actionType: SET_CLIPS,
          payload: {
            clips: res.data
          }
        });
      })
      .catch((err) => {
        if (err.status === 401) {
          console.log(err);
          // dispatchUnauthorizedUser();
        }
      });
  }
};

// function dispatchUnauthorizedUser() {
//   Dispatcher.dispatch({
//     actionType: UNAUTHORIZED_USER
//   });
// }
