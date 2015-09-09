import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import styles from './App.less'; // eslint-disable-line no-unused-vars
import withContext from '../../decorators/withContext'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import debug from 'debug';
import AppTemplate from '../AppTemplate';
import Router from 'react-router';
const RouteHandler = Router.RouteHandler;

const log = debug('clipboard:app');

@withStyles(styles)
class App extends React.Component {

  render() {
    log('App start: rendering first view');
    return (
      <AppTemplate>
        <RouteHandler />
      </AppTemplate>
    );
  }
}

export default App;
