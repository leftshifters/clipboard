import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import styles from './App.less'; // eslint-disable-line no-unused-vars
import withContext from '../../decorators/withContext'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import Header from '../Header';
import NotFoundPage from '../NotFoundPage';
import Container from '../Container';
import ClipApp from '../ClipApp';
import debug from 'debug';
let dbg = debug('clipboard:app');

@withContext
@withStyles(styles)
class App extends React.Component {

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
      <Container>
        {header}
        {component}
      </Container>
    ) : <NotFoundPage />;
  }
}

export default App;
