import BaseStore from './BaseStore';
import {SET_PAGINATION} from '../constants/AppConstants';

class HeaderStore extends BaseStore {
  constructor() {
    super();
    this.pages = null;
  }

  registerToActions(action) {
    switch (action.actionType) {
      case SET_PAGINATION:
        this.pages = action.payload.pages;
        this.emitChange();
        break;
      default:
        break;
    }
  }
}

export default new HeaderStore();
