import {extend} from 'lodash'; // eslint-disable-line no-unused-vars
import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import Styles from './Dropzone.less'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import TextBox from '../TextBox';

@withStyles(Styles)
class Dropzone extends React.Component {

  static propTypes = {
    onDrop: PropTypes.func,
    onDragOver: PropTypes.func,
    onDragLeave: PropTypes.func,
    size: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    style: PropTypes.object,
    supportClick: PropTypes.bool,
    accept: PropTypes.string,
    multiple: PropTypes.bool,
    activeClassName: PropTypes.string
  };

  constructor(props, context) {
    super(props, context);
    this.dispayName = 'Dropzone';
    this.state = {
      isDragActive: false,
      zonedisplay: 'none'
    };
  }

  onDragLeave(e) {
    this.setState({
      isDragActive: false
    });

    if (this.props.onDragLeave) {
      this.props.onDragLeave(e);
    }
  }

  onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';

    // set active drag state only when file is dragged into
    // (in mozilla when file is dragged effect is "uninitialized")
    let effectAllowed = e.dataTransfer.effectAllowed;
    if (effectAllowed === 'all' || effectAllowed === 'uninitialized') {
      this.setState({
        isDragActive: true
      });
    }

    if (this.props.onDragOver) {
      this.props.onDragOver(e);
    }
  }

  onDrop(e) {
    e.preventDefault();

    this.setState({
      isDragActive: false
    });

    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    let maxFiles = (this.props.multiple) ? files.length : 1;
    for (var i = 0; i < maxFiles; i++) {
      files[i].preview = URL.createObjectURL(files[i]);
    }

    if (this.props.onDrop) {
      files = Array.prototype.slice.call(files, 0, maxFiles);
      this.props.onDrop(files, e);
    }
  }

  onClick() {
    if (this.props.supportClick === true) {
      this.open();
    }
  }

  open() {
    let fileInput = React.findDOMNode(this.refs.fileInput);
    fileInput.value = null;
    fileInput.click();
  }

  render() {
    let className = this.props.className || 'dropzone';
    // if (this.state.isDragActive) {
    //   className += this.props.activeClassName || ' active';
    // } else {
    //   className += this.props.activeClassName || ' inactive';
    // }

    let style = {};
    if (this.props.style) { // user-defined inline styles take priority
      style = this.props.style;
    } else if (!this.props.className) { // if no class or inline styles defined, use defaults
      style = {
        width: this.props.width || this.props.size || 100,
        height: this.props.height || this.props.size || 100,
        borderStyle: this.state.isDragActive ? 'solid' : 'dashed'
      };
    }

    return (
      <div>
        <div
          className={className}
          style={style}
          onClick={this.onClick.bind(this)}
          onDragLeave={this.onDragLeave.bind(this)}
          onDragOver={this.onDragOver.bind(this)}
          onDrop={this.onDrop.bind(this)}>
          <TextBox
            className='input-file'
            type='file'
            multiple={this.props.multiple}
            ref='fileInput'
            onChange={this.onDrop.bind(this)}
            accept={this.props.accept} />

          <div className="text-center dropcontainer">
            <h1>Drop it here</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default Dropzone;
