import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import styles from './App.less'; // eslint-disable-line no-unused-vars
import withContext from '../../decorators/withContext'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import Header from '../Header';
import NotFoundPage from '../NotFoundPage';
import Container from '../Container';
import Dashboard from '../Dashboard';

@withContext
@withStyles(styles)
class App extends React.Component {

  render() {
    var header, component;

    switch (this.props.path) {
      case '/':
        header = <Header />;
        component = <Dashboard />;
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
