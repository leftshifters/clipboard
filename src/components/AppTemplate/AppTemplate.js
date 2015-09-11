import debug from 'debug';
import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import withContext from '../../decorators/withContext'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import FileActions from '../../actions/FileActions';
import Container from '../Container';
import Dropzone from '../Dropzone';
import Notify from '../Notify';

const log = debug('clipboard:apptemplate');
var counter = 0;

class AppTemplate extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      dragClass: 'drop-container inactive'
    };
  }

  handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    if(counter === 0) {
      counter++;
      log('Drag counter is %s', counter);
      this.setState({
        dragClass: 'drop-container active'
      });
    }
  }

  handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    if(counter === 1) {
      counter--;
      log('Leave Counter is %s', counter);
      this.setState({
        dragClass: 'drop-container inactive'
      });
    }
  }

  onDrop(file) {
    log('Received files %o', file);
    this.setState({
      dragClass: 'drop-container inactive'
    });
    FileActions.dropFile(file);
  }

  render() {
    log('App start: rendering first view');

    return (
      <Container
        onDragEnter={this.handleDragEnter.bind(this)}
        onMouseLeave={this.handleDragLeave.bind(this)}>
        <Notify />
        <Dropzone
          ref="dropzone"
          className={this.state.dragClass}
          supportClick={false}
          onDrop={this.onDrop.bind(this)}
          multiple={false} />
        {this.props.children}
      </Container>
    );
  }
}

export default AppTemplate;
