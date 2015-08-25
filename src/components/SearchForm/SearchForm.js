import React from 'react'; // eslint-disable-line no-unused-vars
import TextBox from '../TextBox';
import Form from '../Form';
import FormGroup from '../FormGroup';
import ClipActions from '../../actions/ClipActions';
import debug from 'debug';

const log = debug('clipboard:search');
let origin = document.location.origin;

const searchPlaceholder = 'Search';

class SearchForm extends React.Component {
  constructor(context, props) {
    super(context, props);
    this.state = {
      searchText: '',
      iconClass: 'btn btn-default disabled'
    };
    window.history.replaceState(null, null, origin);
  }

  keyup(e) {
    if (!e.target.value) {
      window.history.replaceState(null, null, origin);
      this.setState({
        iconClass: 'btn btn-default disabled',
        searchText: e.target.value
      });
      ClipActions.getClips(1);
    } else {
      window.history.replaceState(
        null,
        null,
        `${origin}?q=${encodeURIComponent(e.target.value)}`
      );

      this.setState({
        iconClass: 'btn btn-default',
        searchText: e.target.value
      });
    }
  }

  textchange(e) {
    this.setState({
      searchText: e.target.value
    });
  }

  submitsearch(e) {
    e.preventDefault();
    ClipActions.searchClips(this.state.searchText, 0);
  }

  render() {
    return (
      <FormGroup>
        <div className='input-group'>
          <TextBox
            name='q'
            type='search'
            className='js-search-input form-control'
            placeholder={searchPlaceholder}
            value={this.state.searchText}
            onChange={this.textchange.bind(this)}
            onKeyUp={this.keyup.bind(this)} />
          <span className='input-group-btn'>
            <button
              type='button'
              onClick={this.submitsearch.bind(this)}
              className={this.state.iconClass}>
              <span className='glyphicon search-icon glyphicon-search'></span>
            </button>
          </span>
        </div>
      </FormGroup>
    );
  }
}

export default SearchForm;
