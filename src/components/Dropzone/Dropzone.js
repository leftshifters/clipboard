import {extend} from 'lodash'; // eslint-disable-line no-unused-vars
import debug from 'debug';
import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import Styles from './Dropzone.less'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
const log = debug('clipboard:dropzone');

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
    accept: PropTypes.string,
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

    let items = e.dataTransfer.items;
    let files = e.dataTransfer.files;
    let finalFiles = [];

    for (let i = 0, item; item = items[i]; ++i) { // eslint-disable-line no-cond-assign
      // Skip this one if we didn't get a file.
      if (item.kind !== 'file') {
        continue;
      }

      let entry = item.webkitGetAsEntry();
      if (entry.isDirectory) {
        log('Entry is %o', entry);
        let zip = new window.JSZip();
        zip.folder(entry.name);

        let dirReader = entry.createReader();
        dirReader.readEntries((entries) => { // eslint-disable-line no-loop-func
          for (let j = 0; j < entries.length; j++) {
            let reader = new FileReader();
            reader.onload = (evt) => { // eslint-disable-line no-loop-func
              zip.file(
                entries[j].name,
                evt.target.result,
                {base64: true}
              );

              console.log('test zip test etesterwtkehr jkerhgrejkg hejkrhjekrghekrg');
            };
            reader.readAsDataURL(entries[j]);
          }
        });

        finalFiles.push({
          name: entry.name,
          content: zip.generate({
            type: 'base64'
          }),
          base64: true
        });
      } else {
        if (entry.isFile && files[i].type.match('^image/')) {
          files[i].preview = URL.createObjectURL(files[i]);
          finalFiles.push(files[i]);
        } else {
          finalFiles.push(files[i]);
        }
      }
    }

    log('Final files inside dropzone are %o', finalFiles);

    if(this.props.onDrop) {
      this.props.onDrop(finalFiles, e);
    }

    // let files;
    // if (e.dataTransfer) {
    //   files = e.dataTransfer.files;
    //   log('items are %o', e.dataTransfer.items);
    // } else if (e.target) {
    //   files = e.target.files;
    // }
    //
    // let maxFiles = files.length;
    // for (var i = 0; i < maxFiles; i++) {
    //   log('Is dir %s', files[i].isDirectory);
    //   files[i].preview = URL.createObjectURL(files[i]);
    // }
    //
    // if (this.props.onDrop) {
    //   log('Files are %o', files);
    //   this.props.onDrop(files, e);
    // }
  }

  render() {
    let className = this.props.className || 'dropzone';

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
          onDragLeave={this.onDragLeave.bind(this)}
          onDragOver={this.onDragOver.bind(this)}
          onDrop={this.onDrop.bind(this)}>
          <div className="text-center dropcontainer">
            <h1>Drop it here</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default Dropzone;
