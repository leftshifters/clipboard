import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import styles from './App.less'; // eslint-disable-line no-unused-vars
import withContext from '../../decorators/withContext'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import Header from '../Header';
import NotFoundPage from '../NotFoundPage';
import Container from '../Container';
import ClipApp from '../ClipApp';
import debug from 'debug';
import Dropzone from '../Dropzone';
import {defer} from 'underscore';

let dbg = debug('clipboard:app');
let counter = 0;

@withContext
@withStyles(styles)
class App extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  dragOver(e) {
    e.preventDefault();
    if(counter++ === 0) {
      dbg('On drag over call %s', counter);
      React.findDOMNode(this.refs.dropzone).className = 'drop-container active';
    }
  }

  // dragOut(e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   dbg('Ondrag out call');
  //   dragActive = false;
  //   React.findDOMNode(this.refs.dropzone).className = 'drop-container inactive';
  // }
  //
  // dragStart(e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   dbg('Drag Start');
  //   if(dragActive) {
  //     return false;
  //   }
  // }
  //
  dragEnd(e) {
    e.preventDefault();
    alert(--counter);
    if(--counter === 0) {
      dbg('Drag end %s', counter);
    }
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
        onDragEnter={this.dragOver.bind(this)}
        onDragLeave={this.dragEnd.bind(this)}>
        {header}
        <Dropzone
          ref="dropzone"
          className="drop-container inactive"
          supportClick={true}
          multiple={false} />
        {component}
      </Container>
    ) : <NotFoundPage />;
  }
}

export default App;
