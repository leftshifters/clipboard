import _ from 'lodash';
import debug from 'debug';
import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import FormGroup from '../FormGroup';
import TextBox from '../TextBox';
import Button from '../Button';
import Extention from '../Extention';
import FileStore from '../../stores/FileStore';
import ClipActions from '../../actions/ClipActions';
import Modal from 'react-bootstrap/lib/Modal';

const log = debug('clipboard:clipmodal');
const imageMimes = [
  'image/png',
  'image/gif',
  'image/jpeg',
  'image/pjpeg',
  'image/bmp',
  'image/x-windows-bmp',
  'image/x-icon'
];

class ClipModal extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = this.getStateFromStore();
    this.onStoreChange = this.onStoreChange.bind(this);
    this.index = 0;
  }

  getStateFromStore() {
    return {
      files: FileStore.files,
      showModal: false,
      fileNames: FileStore.files ? _.map(FileStore.files, (file) => {
        return file.name;
      }) : [],
      inputName: FileStore.files ? FileStore.files[this.index].name : '',
      headerTitle: this.getHeaderTitle(FileStore.files)
    };
  }

  getHeaderTitle(files) {
    files = this.state && this.state.files ? this.state.files : files;
    if(
      _.isEmpty(files) ||
      files.length === 1 ||
      files.length === (this.index + 1)
    ) {
      return 'Upload Clip?';
    } else {
      return `Upload Clip? and ${files.length - (this.index + 1)} more...`;
    }
  }

  onStoreChange() {
    this.setState(this.getStateFromStore());
    log('Store change %o', this.state.files);
    _.defer(() => {
      this.openModal();
    });
  }

  componentDidMount() {
    log('Component mounted');
    FileStore.addChangeListener(this.onStoreChange);
  }

  componentWillUnmount() {
    log('Component unmounted');
    FileStore.removeChangeListener(this.onStoreChange);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if(
  //     nextState.inputName !== this.state.inputName
  //   ) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  onFileNameChange(e) {
    e.preventDefault();
    log('File input change');
    this.setState({
      inputName: e.target.value
    });
  }

  openModal() {
    log('Show modal');
    this.setState({
      showModal: true
    });
  }

  closeModal() {
    log('Hide modal');
    this.setState({
      showModal: false
    });
  }

  getRandomId() {
    return Math.random();
  }

  regenerateModal() {
    log('modal regenerated');
    this.index = this.index + 1;
    if(this.state.files.length === this.index) {
      this.closeModal();
    } else {
      this.setState({
        files: this.state.files,
        inputName: this.state.files[this.index].name,
        headerTitle: this.getHeaderTitle()
      });
    }
  }

  upload(e) {
    log('uploaded');
    e.preventDefault();
    e.stopPropagation();

    let data = new FormData();
    let clip = {};

    data.append('content', this.state.files[this.index]);
    data.append('name', this.state.inputName);

    clip = {
      _id: this.getRandomId(),
      uploading: true,
      name: this.state.inputName,
      originalName: this.state.inputName,
      timeago: 'Just Now',
      url: '#'
    };

    if (data) {
      ClipActions.addClip(clip, data);
      _.defer(() => {
        this.regenerateModal();
      });
    }
  }

  get files() {
    log('Index is %s', this.index);
    log('State change and files are %o', this.state.files);
    let files = [];
    let file = this.state.files ? this.state.files[this.index] : null;
    log('File is %o', file);

    if (file) {
      let type = !!~imageMimes.indexOf(file.type) ? 'image' : file.name.split('.').pop(); //eslint-disable-line no-extra-boolean-cast
      let thumb = '';

      log('File type is %o', type);
      if(type) {
        thumb = <Extention ext={type} />;
      }

      files.push(
        <FormGroup key={new Date().getTime()} className="form-group extra-margin">
          {thumb}
          <label htmlFor="name">
            <span>Name</span>
            <span className="color-9a">
              <small><em>(optional)</em></small>
              </span>
          </label>
          <TextBox
            name="name"
            ref="fileInput"
            placeholder={ this.state.inputName }
            onChange={this.onFileNameChange.bind(this)}
            className="form-control" />
        </FormGroup>
      );
    }

    return files;
  }

  render() {
    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.headerTitle}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {this.files}
          </Modal.Body>

          <Modal.Footer>
            <Button
              buttonFor="Close"
              className="btn btn-default"
              onClick={this.closeModal.bind(this)}/>
            <Button
              buttonFor="Uplaod"
              onClick={this.upload.bind(this)}
              className="btn btn-primary"/>
          </Modal.Footer>

        </Modal>
      </div>
    );
  }
}

export default ClipModal;
