import React, {PropTypes} from 'react';// eslint-disable-line no-unused-vars
// import _ from 'lodash';
import debug from 'debug';
import Styles from './UploadBox.less'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
// import FileStore from '../../stores/FileStore';
import FileActions from '../../actions/FileActions';
// import ClipActions from '../../actions/ClipActions';
// import TextBox from '../TextBox';
// import FormGroup from '../FormGroup';
// import Form from '../Form';
// import Button from '../Button';
import UploadButton from '../UploadButton';
import ClipModal from '../Modal';

const log = debug('clipboard:uplaodbox');
// const uploadPlaceholder = 'clipboard';

@withStyles(Styles)
class UploadBox extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      files: null
    };
    // this.onStoreChange = this.onStoreChange.bind(this);
  }

  // getStateFromStore() {
  //   log('Files from store are %o', FileStore.files);
  //   return {
  //     files: FileStore.files
  //   };
  // }

  // componentDidMount() {
  //   log('Upload box mount');
  //   FileStore.addChangeListener(this.onStoreChange);
  // }
  //
  // componentWillUnmount() {
  //   log('Uplaod box unmount');
  //   // FileStore.removeChangeListener(this.onStoreChange);
  // }

  // onChange(e) {
  //   e.preventDefault();
  //   log('Change name of uplaod file');
  //   // this.setState({
  //   //   inputName: e.target.value
  //   // });
  // }

  // onStoreChange() {
  //   log('File store change');
  //   // this.setState(this.getStateFromStore());
  // }

  // convertImgToBase64(file) {
  //   var fileReader = new FileReader();
  //   return fileReader.readAsDataURL(file);
  // }

  onFileChange(e) {
    e.preventDefault();
    this.setState({
      files: e.target.files
    });

    log('Files are %o', e.target.files);

    // FileActions.dropFile(e.target.files);
    // let zip = new window.JSZip();
    // zip.folder('test');
    // _.each(e.target.files, (f) => {
    //   zip.file(f.name, this.convertImgToBase64(f), {
    //     base64: true
    //   });
    // });
    //
    // let fileName;
    // let file = e.target.files[0];
    //
    // log('file length is %s', e.target.files.length);
    //
    // if (e.target.files.length > 1) {
    //   let filePath = file.webkitRelativePath;
    //   fileName = filePath.split('/')[0];
    // } else {
    //   fileName = file.name;
    // }
    //
    // this.setState({
    //   files: zip.generate({
    //     type: 'base64'
    //   }),
    //   inputName: fileName,
    //   button: ''
    // });
    //
    // React.findDOMNode(this.refs.fileInput).focus();
  }

  // getRandomId() {
  //   return Math.random();
  // }

  submitform() {
    // e.stopPropagation();
    // e.preventDefault();
    //
    // let files = this.state.files;
    // let clip = {};
    // let data = new FormData();
    // data.append('content', files);
    // data.append('name', this.state.inputName);
    // log('Uploaded file is %o', clip);
    //
    // clip = {
    //   _id: this.getRandomId(),
    //   uploading: true,
    //   name: this.state.inputName,
    //   originalName: this.state.inputName,
    //   timeago: 'Just Now',
    //   url: '#'
    // };
    // if (data) {
    //   ClipActions.addClip(clip, data);
    // }
    //
    // this.setState({
    //   files: null,
    //   inputName: ''
    // });

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
    return (
      <div className="pull-left">
        <UploadButton onFileChange={this.onFileChange.bind(this)} />
        <ClipModal refs="modal" files={this.state.files} />
      </div>
    );
  }
}

export default UploadBox;
