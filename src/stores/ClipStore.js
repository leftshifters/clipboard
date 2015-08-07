import BaseStore from './BaseStore';
import {SET_CLIPS} from '../constants/ClipConstants';

class ClipsStore extends BaseStore {
  constructor() {
    super();
    this.clips = null;
  }

  registerToActions(action) {
    switch (action.actionType) {
      case SET_CLIPS:
        this.clips = action.payload.clips;
        this.emitChange();
        break;
      default:
        break;
    }
  }
}

export default new ClipsStore();
