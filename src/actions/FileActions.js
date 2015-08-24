import Dispatcher from '../core/Dispatcher';
import {DROP_FILE} from '../constants/AppConstants';
// import debug from 'debug';
// let dbg = debug('clipboard:fileaction');

export default {
  dropFile(files) {
    Dispatcher.dispatch({
      actionType: DROP_FILE,
      payload: {
        files: files
      }
    });
  }
};
