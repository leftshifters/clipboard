import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import styles from './Header.less'; // eslint-disable-line no-unused-vars
// import withContext from '../../decorators/withContext'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import SearchForm from '../SearchForm';
import Row from '../Row';

// @withContext
@withStyles(styles)
class Header {

  static PropTypes = {
    version: PropTypes.string
  }

  get SearchForm() {
    return (
      <div className="col-md-4">
        <h1>
          <SearchForm />
        </h1>
      </div>
    );
  }

  render() {
    return (
      <Row>
        <div className="col-md-4">
          <h1>
            <a href="/" className="head-logo">Clipboard</a>
            <span className="small"> {this.props.version}</span>
          </h1>
        </div>

        {this.SearchForm}
      </Row>
    );
  }
}

export default Header;
