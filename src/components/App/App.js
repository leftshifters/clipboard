import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import withContext from '../../decorators/withContext'; // eslint-disable-line no-unused-vars
import Header from '../Header';
import SearchForm from '../SearchForm';
import NotFoundPage from '../NotFoundPage';

@withContext
class App extends React.Component {
  render() {
    var header, component;

    switch (this.props.path) {
      case '/':
        header = <Header />;
        component = <SearchForm />;
        break;
    }

    return component ? (
      <div className="react-container">
        {header}
        {component}
      </div>
    ) : <NotFoundPage />;
  }
}

export default App;
