import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import Styles from './ClipApp.less'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import Row from '../Row';
import UploadBox from '../UploadBox';
import Clip from '../Clip';
import Loader from '../Loader';
import ClipsStore from '../../stores/ClipStore';
import ClipActions from '../../actions/ClipActions';
import debug from 'debug';
let dbg = debug('clipboard:dashboard');

@withStyles(Styles)
class ClipApp extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = this.getStateFromStore();
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  getStateFromStore() {
    dbg('Clips from store are %o', ClipsStore.clips);
    return {
      clips: ClipsStore.clips,
      loading: ClipsStore.clips && ClipsStore.clips.length > 0 ? false : true
    };
  }

  componentDidMount() {
    ClipsStore.addChangeListener(this.onStoreChange);
    ClipActions.getClips();
  }

  componentWillUnmount() {
    ClipsStore.removeChangeListener(this.onStoreChange);
  }

  onStoreChange() {
    dbg('State change and render view');
    dbg('Store change %o', arguments);
    this.setState(this.getStateFromStore());
  }

  onEditSave(clip, text) {
    dbg('Title change: Change the state');
    ClipActions.changeTitle(clip._id, {name: text}, clip.id); // eslint-disable-line no-underscore-dangle
  }

  destroy(clip) {
    ClipActions.deleteClip(clip._id, clip.id); // eslint-disable-line no-underscore-dangle
  }

  get FileUploadForm() {
    return (
      <div className="col-lg-3 col-xs-12 col-md-4 col-sm-6 item-row">
       <UploadBox />
      </div>
    );
  }

  get MemoryInfo() {
    return (
      <span className="lead">410.69gb</span>
    );
  }

  get Clips() {
    let clips = [];
    if(this.state.clips && this.state.clips.length > 0) {
      this.state.clips.map((clip, key) => {
        clips.push(
          <Clip
            key={key}
            clip={clip}
            onEditSave={this.onEditSave.bind(this, clip)}
            onDestory={this.destroy.bind(this, clip)} />
        );
      });
    }

    return clips;
  }

  render() {
    dbg('CAUTION!!!!! Rerendering react view');
    return (
      <Row>
        {this.FileUploadForm}
        <Loader loading={this.state.loading} />
        <div className="clips">
          {this.Clips}
        </div>
      </Row>
    );
  }
}

export default ClipApp;
