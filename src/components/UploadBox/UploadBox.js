import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import Styles from './UploadBox.less'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import FileStore from '../../stores/FileStore';
import TextBox from '../TextBox';
import FormGroup from '../FormGroup';
import Button from '../Button';
import debug from 'debug';

const log = debug('clipboard:uplaodbox');
const uploadPlaceholder = 'clipboard';

@withStyles(Styles)
class UploadBox extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = this.getStateFromStore();
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  getStateFromStore() {
    log('Files from store are %o', FileStore.files);
    return {
      files: FileStore.files,
      inputName: FileStore.files && FileStore.files[0] ? FileStore.files[0].name : '',
      button: FileStore.files && FileStore.files[0] ? '' : 'disabled'
    };
  }

  componentDidMount() {
    log('Upload box mount');
    FileStore.addChangeListener(this.onStoreChange);
  }

  componentWillUnmount() {
    log('Uplaod box unmount');
    FileStore.removeChangeListener(this.onStoreChange);
  }

  onChange(e) {
    e.preventDefault();
    log('Change name of uplaod file');
    this.setState({
      inputName: this.value
    });
  }

  onStoreChange() {
    log('File store change');
    this.setState(this.getStateFromStore());
  }

  onClick(e) {
    e.preventDefault();
    React.findDOMNode(this.refs.inputFile).click();
  }

  onFileChange(e) {
    e.preventDefault();
    let file = e.target.files[0];
    log('File change %o', file);
    this.setState({
      files: [file],
      inputName: file.name,
      button: ''
    });

    React.findDOMNode(this.refs.fileInput).focus();
  }

  uplaodFile(e) {
    e.preventDefault();
    let files = this.state.files;
    log('Got files in uplaod %o', files);
    if(files && files[0]){
      log('Uploaded file is %o', files[0]);
    }
  }

  render() {
    log('Rendering upload box');
    return (
      <div className="item add-dialog">
        <FormGroup className="form-group extra-margin">
        <Button
          type="button"
          className="btn-default btn-block btn-select"
          buttonFor="Select a file"
          onClick={this.onClick.bind(this)} />
        </FormGroup>
        <FormGroup className="form-group extra-margin">
          <label htmlFor="name">
            <span>Name</span>
            <span className="color-9a">
              <small><em> (optional)</em></small>
            </span>
          </label>
          <TextBox
            name="name"
            ref="fileInput"
            onChange={this.onChange.bind(this)}
            value={this.state.inputName}
            placeholder={uploadPlaceholder}
            className="form-control" />
        </FormGroup>
        <Button
          type="button"
          disabled={this.state.button}
          className="btn-primary btn-submit center-block btn-lg"
          buttonFor="Upload"
          onClick={this.uplaodFile.bind(this)} />
        <TextBox
          type="file"
          name="content"
          ref="inputFile"
          className="input-file"
          onChange={this.onFileChange.bind(this)} />
      </div>
    );
  }
}

export default UploadBox;
