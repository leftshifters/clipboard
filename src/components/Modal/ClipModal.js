import _ from 'lodash';
import debug from 'debug';
import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import Form from '../Form';
import FormGroup from '../FormGroup';
import TextBox from '../TextBox';
import Button from '../Button';
import Extention from '../Extention';
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

  static propTypes = {
    files: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
    this.state = this.getStateFromStore();
    this.inputName = '';
  }

  getStateFromStore() {
    log(this.props);
    return {
      showModal: this.props.files ? true : false,
      index: 0
    };
  }

  getHeaderTitle(files) {
    if(
      _.isEmpty(files) ||
      files.length === 1 ||
      files.length === (this.state.index + 1)
    ) {
      return 'Upload Clip?';
    } else {
      return `Upload Clip? and ${files.length - (this.state.index + 1)} more...`;
    }
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
    if(this.props.files.length === this.state.index) {
      this.closeModal();
    } else {
      this.setState({
        headerTitle: this.getHeaderTitle(this.props.files)
      });
    }

    this.setState({
      index: this.state.index + 1
    });
  }

  onTitleChange(e) {
    e.preventDefault();
    this.inputName = e.target.value;
  }

  upload(e) {
    log('uploaded');
    e.preventDefault();
    e.stopPropagation();

    let data = new FormData();
    let clip = {};

    data.append('content', this.props.files[this.state.index]);
    data.append('name', this.inputName);

    clip = {
      _id: this.getRandomId(),
      uploading: true,
      name: this.inputName,
      originalName: this.props.files[this.state.index].name,
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

  componentWillReceiveProps() {
    log('Received new props')
    this.getStateFromStore();
  }

  get files() {
    log('Index is %s', this.state.index);
    log('State change and files are %o', this.props.files);
    log('State is %o', this.state);
    let files = [];
    let file = this.props.files ? this.props.files[this.state.index] : null;
    this.inputName = file ? file.name : '';

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
            onChange={this.onTitleChange.bind(this)}
            placeholder={file.name}
            className="form-control" />
        </FormGroup>
      );
    }

    return files;
  }

  render() {
    log('File length %s', this.props.files ? this.props.files.length : 0);
    log('Index is %s', this.state.index);

    let showModal = (
        this.props.files && this.props.files.length > (this.state.index)
      ) ? true : this.state.showModal;
    let headerTitle = this.getHeaderTitle(this.props.files);

    return (
      <div>
        <Modal show={showModal} onHide={this.closeModal.bind(this)}>
          <Form
           role="form"
           method="post"
           action="#"
           encType="multipart/form-data"
           className="upload-form"
           ref="uploadform"
           onSubmit={this.upload.bind(this)}>
            <Modal.Header closeButton>
              <Modal.Title>{headerTitle}</Modal.Title>
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
          </Form>
        </Modal>
      </div>
    );
  }
}

export default ClipModal;
