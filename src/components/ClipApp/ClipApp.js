import _ from 'lodash';
import debug from 'debug';
import React, {
  PropTypes
}
from 'react'; // eslint-disable-line no-unused-vars
import Styles from './ClipApp.less'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import Row from '../Row';
import UploadBox from '../UploadBox';
import Clip from '../Clip';
import Loader from '../Loader';
import Header from '../Header';
import Footer from '../Footer';
import Container from '../Container';
import Dropzone from '../Dropzone';
import ClipsStore from '../../stores/ClipStore';
import ClipActions from '../../actions/ClipActions';
import FileActions from '../../actions/FileActions';

let log = debug('clipboard:dashboard');
var counter = 0;

@
withStyles(Styles)
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
      message: ClipsStore.clips && ClipsStore.clips.length === 0 ? true : false,
      dragClass: 'drop-container inactive'
    };
  }

  handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    if (counter === 0) {
      counter++;
      log('Drag counter is %s', counter);
      this.setState({
        dragClass: 'drop-container active'
      });
    }
  }

  handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    if (counter === 1) {
      counter--;
      log('Leave Counter is %s', counter);
      this.setState({
        dragClass: 'drop-container inactive'
      });
    }
  }

  onDrop(file) {
    log('Received files %o', file);
    this.setState({
      dragClass: 'drop-container inactive'
    });
    FileActions.dropFile(file);
  }

  componentDidMount() {
    log('Clips component mount');
    let parms = this.props.params;
    let query = this.props.query;
    let page = !_.isNaN(_.parseInt(parms.page)) ? _.parseInt(parms.page) :
      1;

    ClipsStore.addChangeListener(this.onStoreChange);

    log(this.refs.searchbutton);

    if (query && !_.isEmpty(query.q)) {
      ClipActions.searchClips(query.q, parms.page);
    } else {
      ClipActions.getClips(page);
    }
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
    ClipActions.changeTitle(clip._id, {
      name: text
    }, clip.id); // eslint-disable-line no-underscore-dangle
  }

  destroy(clip) {
    log('Deleted clip: Store change');
    let page = this.props.params.page || 1;
    if (clip.uploading) {
      ClipActions.getClips(page);
    } else {
      ClipActions.deleteClip(clip._id, page); // eslint-disable-line no-underscore-dangle
    }
  }

  get FileUploadForm() {
    return ( < div className =
      "col-lg-3 col-xs-12 col-md-4 col-sm-6 item-row" >
      < UploadBox / >
      < /div>
    );
  }

  get Clips() {
    let clips = [];
    if (this.state.clips && this.state.clips.length > 0) {
      this.state.clips.map((clip, key) => {
        if (key <= 19) {
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
    return ( < Container onDragEnter = {
        this.handleDragEnter.bind(this)
      }
      onMouseLeave = {
        this.handleDragLeave.bind(this)
      } >
      < Dropzone className = {
        this.state.dragClass
      }
      supportClick = {
        false
      }
      onDrop = {
        this.onDrop.bind(this)
      }
      multiple = {
        false
      }
      /> < div > < Header version = {
        this.props.version
      }
      query = {
        this.props ? this.props.query.q : ''
      }
      /> < Row > < Loader loading = {
        this.state.loading
      }
      /> < div className = "clips"
      ref = "clips" > {
        this.Clips
      } < /div> < /Row > < Footer / >
      < /div> < /Container >
    );
  }
}

export default ClipApp;
