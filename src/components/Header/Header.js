import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import styles from './Header.less'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import SearchForm from '../SearchForm';
import Row from '../Row';

@withStyles(styles)
class Header {

  get searchForm() {
    return (
      <div class='col-md-4'>
        <h1>
          <SearchForm />
        </h1>
      </div>
    );
  }

  render() {
    return (
      <Row>
        <div class='col-md-4'>
          <h1>
            <a href='/' class='head-logo'>Clipboard</a>
            <span class="small"> 0.0.8</span>
          </h1>
        </div>

        {this.searchForm}
      </Row>
    );
  }
}

