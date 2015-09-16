import React, {
  PropTypes // eslint-disable-line no-unused-vars
}
from 'react';
import _ from 'lodash';
import Styles from './UploadBox.less'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import FileStore from '../../stores/FileStore';
import ClipActions from '../../actions/ClipActions';
import TextBox from '../TextBox';
import FormGroup from '../FormGroup';
import Form from '../Form';
import Button from '../Button';
import debug from 'debug';

const log = debug('clipboard:uplaodbox');
const uploadPlaceholder = 'clipboard';

@
withStyles(Styles)
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
      inputName: FileStore.files && FileStore.files[0] ? FileStore.files[0]
        .name : '',
      button: FileStore.files && FileStore.files[0] ? '' : 'disabled'
    };
  }

  componentDidMount() {
    log('Upload box mount');
    FileStore.addChangeListener(this.onStoreChange);
    // React
    //   .findDOMNode(this.refs.inputFile)
    //   .setAttribute('webkitdirectory', '');
    // React
    //   .findDOMNode(this.refs.inputFile)
    //   .setAttribute('directory', '');
    React
      .findDOMNode(this.refs.inputFile)
      .setAttribute('multiple', '');
  }

  componentWillUnmount() {
    log('Uplaod box unmount');
    FileStore.removeChangeListener(this.onStoreChange);
  }

  onChange(e) {
    e.preventDefault();
    log('Change name of uplaod file');
    this.setState({
      inputName: e.target.value
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

  convertImgToBase64(file) {
    var fileReader = new FileReader();
    return fileReader.readAsDataURL(file);
  }

  onFileChange(e) {
    e.preventDefault();

    let zip = new window.JSZip();
    zip.folder('test');
    _.each(e.target.files, (f) => {
      zip.file(f.name, this.convertImgToBase64(f), {
        base64: true
      });
    });

    let fileName;
    let file = e.target.files[0];

    log('file length is %s', e.target.files.length);

    if (e.target.files.length > 1) {
      let filePath = file.webkitRelativePath;
      fileName = filePath.split('/')[0];
    } else {
      fileName = file.name;
    }

    this.setState({
      files: zip.generate({
        type: 'base64'
      }),
      inputName: fileName,
      button: ''
    });

    React.findDOMNode(this.refs.fileInput).focus();
  }

  getRandomId() {
    return Math.random();
  }

  submitform(e) {
    e.stopPropagation();
    e.preventDefault();

    let files = this.state.files;
    let clip = {};
    let data = new FormData();
    data.append('content', files);
    data.append('name', this.state.inputName);
    log('Uploaded file is %o', clip);

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
    }

    this.setState({
      files: null,
      inputName: ''
    });

    // if (files && files.length >= 1) {
    //   _.each(e.target.files, (f) => {
    //     data.append('content', f);
    //   });
    //
    //   data.append('name', this.state.inputName);
    //
    //   clip = {
    //     _id: this.getRandomId(),
    //     uploading: true,
    //     name: this.state.inputName,
    //     originalName: this.state.inputName,
    //     timeago: 'Just Now',
    //     url: '#'
    //   };
    //
    //   log('Uploaded file is %o', clip);
    //   if (data) {
    //     ClipActions.addClip(clip, data);
    //   }
    //
    //   this.setState({
    //     files: null,
    //     inputName: ''
    //   });
    // }
  }

  render() {
    log('Rendering upload box');
    return ( < div className = "item add-dialog" >
      < Form role = "form"
      method = "post"
      action = "#"
      className = "upload-form"
      ref = "uploadform"
      onSubmit = {
        this.submitform.bind(this)
      } >
      < FormGroup className = "form-group extra-margin" >
      < Button type = "button"
      className = "btn-default btn-block btn-select"
      buttonFor = "Select a file"
      onClick = {
        this.onClick.bind(this)
      }
      /> < /FormGroup > < FormGroup className = "form-group extra-margin" >
      < label htmlFor = "name" >
      < span > Name < /span> < span className = "color-9a" > < small > <
      em > (optional) < /em></small >
      < /span> < /label > < TextBox name = "name"
      ref = "fileInput"
      onChange = {
        this.onChange.bind(this)
      }
      value = {
        this.state.inputName
      }
      placeholder = {
        uploadPlaceholder
      }
      className = "form-control" / >
      < /FormGroup> < Button type = "submit"
      disabled = {
        this.state.button
      }
      className = "btn-primary btn-submit center-block btn-lg"
      buttonFor = "Upload" / >
      < TextBox type = "file"
      name = "content"
      ref = "inputFile"
      webkitdirectory = ""
      directory = ""
      className = "input-file"
      onChange = {
        this.onFileChange.bind(this)
      }
      /> < /Form > < /div>
    );
  }
}

export default UploadBox;
