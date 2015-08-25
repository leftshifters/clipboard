import { canUseDOM } from 'react/lib/ExecutionEnvironment';
import Dispatcher from '../core/Dispatcher';
import {CHANGE_LOCATION} from '../constants/AppConstants';

export default {
  navigateTo(path) {
    if (canUseDOM) {
      window.history.replaceState({}, document.title, path);
    }

    setTimeout(() => {
      Dispatcher.dispatch({
        actionType: CHANGE_LOCATION,
        payload: {
          path: path
        }
      });
    }, 1);
  }
};
