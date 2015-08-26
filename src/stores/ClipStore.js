import BaseStore from './BaseStore';
import {SET_CLIPS, CHANGE_TITLE, DELETE_CLIP, UPLOADING_CLIP} from '../constants/ClipConstants';
import debug from 'debug';

const log = debug('clipboard:clipstore');

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
      case CHANGE_TITLE:
        this.clips = action.payload.clips;
        this.emitChange();
        break;
      case DELETE_CLIP:
        this.clips = action.payload.clips;
        this.emitChange();
        break;
      case UPLOADING_CLIP:
        if(this.clips) {
          log('Store clip %o', action.payload.clip);
          this.clips.unshift(action.payload.clip);
        } else {
          log('Store clip %o', action.payload.clip);
          this.clips = [action.payload.clip];
        }
        this.emitChange();
        break;
      default:
        break;
    }
  }
}

export default new ClipsStore();
