import _ from 'lodash';
import debug from 'debug';
import React, {PropTypes} from 'react';
import FormGroup from '../FormGroup';
import TextBox from '../TextBox';
import Button from '../Button';
import FileStore from '../../stores/FileStore';
import Modal from 'react-bootstrap/lib/Modal';

const log = debug('clipboard:clipmodal');

class ClipModal extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = this.getStateFromStore();
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  getStateFromStore() {
    return {
      files: FileStore.files,
      showModal: false,
      fileNames: FileStore.files ? _.map(FileStore.files, (file) => {
        return file.name
      }) : []
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

  onChange(e) {
    e.preventDefault();
    log('File input change');
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

  get files() {
    log('State change and files are %o', this.state.files);
    let files = [];

    _.each(this.state.files, (file, index) => {
      files.push(
        <FormGroup key={index} className="form-group extra-margin">
          <label htmlFor="name">
            <span>{index+1}) Name</span>
            <span className="color-9a">
              <small><em>(optional)</em></small>
              </span>
          </label>
          <TextBox
            name="name[]"
            ref="fileInput"
            value={this.state.fileNames[index]}
            onChange={this.onChange.bind(this)}
            placeholder={this.state.fileNames[index]}
            className="form-control" />
        </FormGroup>
      );
    });

    return files;
  }

  render() {
    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Upload Clip(s)</Modal.Title>
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
              className="btn btn-primary"/>
          </Modal.Footer>

        </Modal>
      </div>
    );
  }
}

export default ClipModal;
