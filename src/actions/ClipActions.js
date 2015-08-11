import apiUtils from '../utils/apiUtils';
import Dispatcher from '../core/Dispatcher';
import {CHANGE_TITLE} from '../constants/ClipConstants';

export default {
  changeTitle(id) {
    apiUtils.changeTitle(id)
      .then((res) => {
        Dispatcher.dispatch({
          actionType: CHANGE_TITLE,
          payload: {
            clip: res.item
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
}