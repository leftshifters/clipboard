import React from 'react'; // eslint-disable-line no-unused-vars
import TextBox from '../TextBox';
import Form from '../Form';
import FormGroup from '../FormGroup';
// import debug from 'debug'('clipboard:SearchForm');

const searchPlaceholder = 'Search';

class SearchForm extends React.Component {
  constructor() {
    super();
  }

  // onSearchTextChange(e) {
  //   // console.log('Search text change %o', e);
  // }

  render() {
    return (
      <Form inline action='/' className='search-form'>
        <FormGroup>
          <div className='input-group'>
            <TextBox
              name='q'
              type='search'
              className='js-search-input form-control'
              placeholder={searchPlaceholder} />
            <span className='input-group-btn'>
              <button type='submit' className='btn btn-default disabled'>
                <span className='glyphicon search-icon glyphicon-search'></span>
              </button>
            </span>
          </div>
        </FormGroup>
      </Form>
    );
  }
}

export default SearchForm;
