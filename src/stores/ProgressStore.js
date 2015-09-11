import { PROGRESS } from '../constants/ClipConstants';
import BaseStore from './BaseStore';

class ProgressStore extends BaseStore {
  constructor() {
    super();
    this.progress = 0;
  }

  registerToActions(action) {
    switch (action.actionType) {
      case PROGRESS:
        this.progress = action.payload.percent;
        this.emitChange();
        break;
      default:
        break;
    }
  }
}

export default new ProgressStore();
