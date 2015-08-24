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

let dbg = debug('clipboard:app');
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
      dbg('Drag counter is %s', counter);
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
      dbg('Leave Counter is %s', counter);
      this.setState({
        dragClass: 'drop-container inactive'
      });
    }
  }

  onDrop(file) {
    dbg('Received files %o', file);
    this.setState({
      dragClass: 'drop-container inactive'
    });
    FileActions.dropFile(file);
  }

  render() {
    dbg('Rendering main app');
    var header, component;

    switch (this.props.path) {
      case '/':
        header = <Header version={this.props.version} />;
        component = <ClipApp />;
        break;
    }

    return component ? (
      <Container
        onDragEnter={this.handleDragEnter.bind(this)}
        onMouseLeave={this.handleDragLeave.bind(this)}>
        {header}
        <Dropzone
          ref="dropzone"
          className={this.state.dragClass}
          supportClick={true}
          onDrop={this.onDrop.bind(this)}
          multiple={false} />
        {component}
      </Container>
    ) : <NotFoundPage />;
  }
}

export default App;
