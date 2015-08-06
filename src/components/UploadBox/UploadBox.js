import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import Styles from './UploadBox.less'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import TextBox from '../TextBox';
import Form from '../Form';
import FormGroup from '../FormGroup';
import Button from '../Button';

const uploadPlaceholder = 'clipboard';

@withStyles(Styles)
class UploadBox extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      inputName: '',
      button: 'disabled'
    };
  }

  onChange(e) {
    e.preventDefault();
    this.setState({
      inputName: this.value
    });
  }

  onClick(e) {
    e.preventDefault();
    React.findDOMNode(this.refs.inputFile).click();
  }

  onFileChange(e) {
    e.preventDefault();
    let file = e.target.files[0];
    this.setState({
      inputName: file.name,
      button: ''
    });

    React.findDOMNode(this.refs.fileInput).focus();
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
            buttonFor="Upload" />
          <TextBox
            type="file"
            name="content"
            ref="inputFile"
            className="input-file"
            onChange={this.onFileChange.bind(this)} />
        </Form>
      </div>
    );
  }
}

export default UploadBox;
