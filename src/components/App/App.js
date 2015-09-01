import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import styles from './App.less'; // eslint-disable-line no-unused-vars
import withContext from '../../decorators/withContext'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import Header from '../Header';
import NotFoundPage from '../NotFoundPage';
import FileActions from '../../actions/FileActions';
import Container from '../Container';
import ClipApp from '../ClipApp';
import debug from 'debug';
import Dropzone from '../Dropzone';
import ClipDetail from '../ClipDetail';
import _ from 'lodash';

const log = debug('clipboard:app');
var counter = 0;

@withContext
@withStyles(styles)
class App extends React.Component {

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
    let container, dropZone, header, component;
    let page = 1;

    if(this.props.path.indexOf('/page') >= 0) {
      this.props.path = '/page';
      page = _.isNaN(_.parseInt(this.props.path.split('/').pop())) ?
        1 :
        _.parseInt(this.props.path.split('/').pop());
    } else if(this.props.path.indexOf('/clipd') >= 0) {
      this.props.path = '/clipd';
    }

    switch (this.props.path) {
      case '/':
      case '/page':
        container = true;
        dropZone = <Dropzone
          ref="dropzone"
          className={this.state.dragClass}
          supportClick={false}
          onDrop={this.onDrop.bind(this)}
          multiple={false} />;
        header = <Header version={this.props.version} />;
        component = <ClipApp page={page} />;
        break;
      case '/clipd':
        container = false;
        dropZone = header = '';
        component = <ClipDetail />;
        break;
      default:
        break;
    }

    return component ? (
      <Container
        onDragEnter={container ? this.handleDragEnter.bind(this) : ''}
        onMouseLeave={container ? this.handleDragLeave.bind(this) : ''}>
        {header}
        {dropZone}
        {component}
      </Container>
    ) : <NotFoundPage />;
  }
}

export default App;
