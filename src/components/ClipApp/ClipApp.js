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
let log = debug('clipboard:dashboard');

@withStyles(Styles)
class ClipApp extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = this.getStateFromStore();
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  getStateFromStore() {
    log('Fetched clips from store %o', ClipsStore.clips);
    return {
      clips: ClipsStore.clips,
      loading: ClipsStore.clips ? false : true,
      message: ClipsStore.clips && ClipsStore.clips.length === 0 ? true : false
    };
  }

  componentDidMount() {
    log('Clips component mount');
    ClipsStore.addChangeListener(this.onStoreChange);
    ClipActions.getClips(this.props.page);
  }

  componentWillUnmount() {
    log('Clips component unmount');
    ClipsStore.removeChangeListener(this.onStoreChange);
  }

  onStoreChange() {
    log('Clip Store change');
    this.setState(this.getStateFromStore());
  }

  onEditSave(clip, text) {
    log('Clip title change: Change the state');
    ClipActions.changeTitle(clip._id, {name: text}, clip.id); // eslint-disable-line no-underscore-dangle
  }

  destroy(clip) {
    log('Deleted clip: Store change');
    if(clip.uploading) {
      ClipActions.getClips(this.props.page);
    } else {
      ClipActions.deleteClip(clip._id, clip.id); // eslint-disable-line no-underscore-dangle
    }
  }

  get FileUploadForm() {
    return (
      <div className="col-lg-3 col-xs-12 col-md-4 col-sm-6 item-row">
       <UploadBox />
      </div>
    );
  }

  get Clips() {
    let clips = [];
    if(this.state.clips && this.state.clips.length > 0) {
      this.state.clips.map((clip, key) => {
        if(key <= 18) {
          clips.push(
            <Clip
              key={clip.id}
              clip={clip}
              onEditSave={this.onEditSave.bind(this, clip)}
              onDestory={this.destroy.bind(this, clip)} />
          );
        }
      });
    }

    return clips;
  }

  render() {
    log('Rendering clip view');
    return (
      <Row>
        {this.FileUploadForm}
        <Loader loading={this.state.loading} />
        <div className="clips" ref="clips">
          {this.Clips}
        </div>
      </Row>
    );
  }
}

export default ClipApp;
