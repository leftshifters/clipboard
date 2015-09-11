import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import DocMeta from 'react-doc-meta';
import debug from 'debug';
import Styles from './ClipDetail.less'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import Row from '../Row';
import Loader from '../Loader';
import ClipStore from '../../stores/ClipStore';
import ClipActions from '../../actions/ClipActions';

const log = debug('clipboard:clipdetail');

@withStyles(Styles)
class ClipDetail extends React.Component {

  static propTypes = {
    hash: PropTypes.string,
    name: PropTypes.string
  };

  constructor(props, context) {
    super(props, context);
    this.state = this.getStateFromStore();
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  getStateFromStore() {
    return {
      loading: ClipStore.clip ? false : true,
      clip: ClipStore.clip
    };
  }

  componentDidMount() {
    log('Clip detail component mount');
    log('Hash is %s and name is %s', this.props.params.hash, this.props.params.name);
    ClipStore.addChangeListener(this.onStoreChange);
    ClipActions.getClip(this.props.params.hash, this.props.params.name);
  }

  componentWillUnmount() {
    log('Clip detail component unmount');
    ClipStore.removeChangeListener(this.onStoreChange);
  }

  onStoreChange() {
    log('Clip Store change');
    this.setState(this.getStateFromStore());
  }

  get ifTypeImage() {
    let clip = this.state.clip || {};
    if(clip.type !== 'image') {
      return '';
    }

    return (
      <div className="item">
        <div className="item-inner item-detail">
          <img src={clip.url} />
        </div>
      </div>
    );
  }

  get ifTypeQr() {
    let clip = this.state.clip || {};
    if(!clip.qrImage) {
      return '';
    }

    return (
      <div>
        <img className="qrcode" src={clip.qrImage} width="165" height="165" alt="QR Code" />
        <p className="small center">Drag and save this image to share this release</p>
      </div>
    );
  }

  get button() {
    let clip = this.state.clip || {};
    log('clip is clip %o', clip);

    if(clip.type === 'ipa') {
      return (
        <div className="download">
          <div className="btn-group">
            <a href={clip.installUrl} className="btn btn-primary btn-lg">Install IPA</a>
          </div>
        </div>
      );
    } else if(clip.type === 'apk') {
      return (
        <div className="download">
          <div className="btn-group">
            <a href={clip.downloadUrl} className="btn btn-primary btn-lg">Install APK</a>
          </div>
        </div>
      );
    } else {
      log('COMING HERE %o', clip);
      return (
        <div className="download">
          <div className="btn-group">
            <a href={clip.downloadUrl} title={clip.name} className="btn btn-primary btn-lg">Download</a>
          </div>
        </div>
      );
    }
  }

  render() {
    let clip = this.state.clip || {};
    let clazz = this.state.loading ? 'row center-block hidden' : 'row center-block active';
    let size = ` ${clip.mime} `;

    if(clip.size) {
      size += `(${clip.size} bytes) `;
    }

    if(clip.type === 'image') {
      size += `(W x H): ${clip.width} x ${clip.height}`;
    }

    let tags = [
      {name: 'og:title', content: clip.name},
      {name: 'og:type', content: 'object'},
      {name: 'og:url', content: clip.ogUrl}
    ];

    if(clip.qrImage) {
      tags.push({name: 'og:image', content: clip.qrImage});
    }

    if(clip.type === 'image') {
      tags.push(
        {name: 'og:image', content: clip.url},
        {name: 'og:image:type', content: clip.mime}
      );
    }

    log('rendering clip detail page');
    return (
      <div>
        <DocMeta tags={tags} />
        <Loader loading={this.state.loading} />
        <Row className={clazz}>
          <h2>{clip.name}</h2>
          {this.ifTypeImage}
          {this.ifTypeQr}
          {this.button}
          <div className="stats-details panel panel-body">
            <div className="interests col-lg-7">
              <span>
                <i className="glyphicon glyphicon-download text-success"></i>
                &nbsp;{clip.downloaded} reps
              </span>&nbsp;
              <span>
                <i className="glyphicon glyphicon-file text-success"></i>
                {size}
              </span>
            </div>
            <div className="added col-xs-7 col-lg-2 pull-right">
              <span className="pull-right">Added on {clip.added}</span>
            </div>
          </div>
        </Row>
      </div>
    );
  }
}

export default ClipDetail;
