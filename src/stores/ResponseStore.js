import { GOT_ERROR, GOT_SUCCESS } from '../constants/AppConstants';
import BaseStore from './BaseStore';

class ResponseStore extends BaseStore {

  constructor() {
    super();
    this.success = null;
    this.error = null;
  }

  registerToActions(action) {
    switch (action.actionType) {
      case GOT_ERROR:
        this.error = action.payload.error;
        this.emitChange();
        break;
      case GOT_SUCCESS:
        this.success = action.payload.success;
        this.emitChange();
        break;
    }
  }
}

export default new ResponseStore();
