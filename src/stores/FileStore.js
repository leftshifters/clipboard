import BaseStore from './BaseStore';
import {DROP_FILE} from '../constants/AppConstants';

class FileStore extends BaseStore {
  constructor() {
    super();
    this.files = null;
  }

  registerToActions(action) {
    switch (action.actionType) {
      case DROP_FILE:
        this.files = action.payload.files;
        this.emitChange();
        break;
      default:
        break;
    }
  }
}

export default new FileStore();
