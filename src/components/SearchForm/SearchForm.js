import React from 'react'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import TextBox from '../TextBox';
import debug as 'clipboard:searchForm' from 'debug';
import Form from '../Form';
import FormGroup from '../FormGroup';

const searchPlaceHolder = 'Search';

class SearchForm extends React.Components {
  constructor() {
    super();

    this.state = {
      q: ''
    };
  }

  onSearchChange(e) {
    debug('search state change %o', e);
  }

  render() {
    return (
      <Form inline className='search-form'>
        <FormGroup>
          <div class='input-group'>
            <TextBox
              type='search'
              className='form-control js-search-input'
              name='q'
              onChange={this.onSearchChange.bind(e)}
              placeholder={searchPlaceHolder} />
            <span class='input-group-btn'>
              <button type="submit" class="btn btn-default disabled">
                <span class="glyphicon search-icon glyphicon-search"></span>
              </button>
            </span>
          </div>
        </FormGroup>
      </Form>
    );
  }
}

export default SearchForm;