import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import styles from './App.less'; // eslint-disable-line no-unused-vars
import withContext from '../../decorators/withContext'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import Header from '../Header';
import Footer from '../Footer';
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
    let container, dropZone, header, component, footer;
    let hash, name, path = this.props.path;
    let page = 1;

    if(path.indexOf('/page') >= 0) {
      path = '/page';
      page = _.isNaN(_.parseInt(path.split('/').pop())) ?
        1 :
        _.parseInt(path.split('/').pop());
    } else if(path.indexOf('/clipd') >= 0) {
      hash = path.split('/').slice(-2)[0];
      name = path.split('/').pop();
      log('hash: %s and name: %s', hash, name);
      path = '/clipd';
    }

    switch (path) {
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
        footer = <Footer />;
        break;
      case '/clipd':
        container = false;
        dropZone = header = footer = '';
        component = <ClipDetail hash={hash} name={name} />;
        break;
      case '/8b66041e096772f9c0c3c4adb2f625ab.txt':
        container = false;
        component = '<div>detectify</div>';
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
        {footer}
      </Container>
    ) : <NotFoundPage />;
  }
}

export default App;
