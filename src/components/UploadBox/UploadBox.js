import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import Styles from './UploadBox.less'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import TextBox from '../TextBox';
import Form from '../Form';
import FormGroup from '../FormGroup';

const uploadPlaceholder = 'clipboard';

@withStyles(Styles)
class UploadBox extends React.Component {

  constructor() {
    super();
    this.state = {
      name: ''
    };
  }

  onClick(e) {
    e.preventDefault();
    let fileUplaoder = document.getElementById('input-file');
    fileUplaoder.click();
  }

  onFileChange(e) {
    e.preventDefault();
    let file = e.target.files[0];
    let input = document.getElementById('name');
    let uploadButton = document.getElementById('button-uplaod');
    input.value = file.name;
    input.focus();
    uploadButton.disabled = false;
    this.setState({name: file.name});
  }

  render() {
    return (
      <div className="item add-dialog">
        <Form
          role="form"
          method="post"
          action="/upload"
          encType="multipart/form-data"
          className="upload-form">
          <FormGroup className="form-group extra-margin">
            <button
              type="button"
              className="btn btn-default btn-block btn-select"
              onClick={this.onClick.bind(this)}>Select a file</button>
          </FormGroup>
          <FormGroup className="form-group extra-margin">
            <label htmlFor="name">
              <span>Name</span>
              <span className="color-9a">
                <small><em> (optional)</em></small>
              </span>
            </label>
            <TextBox
              type="text"
              name="name"
              id="name"
              value={this.state.inputNameState}
              placeholder={uploadPlaceholder}
              className="form-control" />
          </FormGroup>
          <button
            type="submit"
            disabled="disabled"
            id="button-uplaod"
            className="btn btn-primary btn-submit center-block btn-lg">Upload</button>
          <TextBox
            type="file"
            id="input-file"
            name="content"
            className="input-file"
            onChange={this.onFileChange.bind(this)} />
        </Form>
      </div>
    );
  }
}

export default UploadBox;
