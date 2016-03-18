import React, {PropTypes} from 'react';
import {Router, Route} from 'react-router';

import App from '../App';
import NotFoundPage from '../NotFoundPage';
import ClipDetail from '../ClipDetail';

class Root extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  render() {
    const {history} = this.props;
    return (
      <Router history={history}>
        <Route name='clips' path='/' component={App}>
        </Route>
      </Router>
    );
  }
}

export default Root;