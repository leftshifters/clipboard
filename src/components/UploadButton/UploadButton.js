import React, {PropTypes} from 'react';
import debug from 'debug';
import Styles from './UploadButton.less'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import TextBox from '../TextBox';
import Button from '../Button';

const log = debug('clipboard:uploadbutton');

@withStyles(Styles)
class UploadButton extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  onClick(e) {
    log('File upload initiated');
    e.preventDefault();
    React.findDOMNode(this.refs.inputFile).click();
  }

  componentDidMount() {
    React
      .findDOMNode(this.refs.inputFile)
      .setAttribute('multiple', '');
  }

  render() {
    log('Rendering uplaod button');
    return (
      <div>
        <Button
          buttonFor="Upload Clip"
          className="btn btn-primary btn-upload"
          onClick={this.onClick.bind(this)} />
        <TextBox
          type="file"
          name="content"
          ref="inputFile"
          className="input-file"
          onChange={this.props.onFileChange} />
      </div>
    );
  }
}

export default UploadButton;
