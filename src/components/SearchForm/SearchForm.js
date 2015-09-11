import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import debug from 'debug';
import TextBox from '../TextBox';
import FormGroup from '../FormGroup';
import ClipActions from '../../actions/ClipActions';

const searchPlaceholder = 'Search';
const log = debug('clipboard:searchform');

class SearchForm extends React.Component {

  static contextTypes = {
    router: React.PropTypes.func
  };

  static propTypes = {
    query: PropTypes.string
  };

  constructor(context, props) {
    super(context, props);
    this.state = {
      searchText: this.props.query || '',
      iconClass: 'btn btn-default disabled'
    };
  }

  keyup(e) {
    if (!e.target.value) {
      this.context.router.replaceWith('/');
      this.setState({
        iconClass: 'btn btn-default disabled',
        searchText: e.target.value
      });
      ClipActions.getClips(1);
    } else {
      this
        .context
        .router
        .replaceWith('/?', null, {q: encodeURIComponent(e.target.value)});

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
    ClipActions.searchClips(this.state.searchText, 1);
  }

  keypress(e) {
    let code = e.keyCode || e.which;
    log('Key code is %s', code);
    if(code !== 13) {
      return;
    }

    React.findDOMNode(this.refs.searchbutton).click();
  }

  render() {
    return (
      <FormGroup>
        <div className='input-group searchForm'>
          <TextBox
            name='q'
            type='search'
            className='js-search-input form-control'
            placeholder={searchPlaceholder}
            value={this.state.searchText}
            onChange={this.textchange.bind(this)}
            onKeyUp={this.keyup.bind(this)}
            onKeyPress={this.keypress.bind(this)} />
          <span className='input-group-btn'>
            <button
              type='button'
              ref='searchbutton'
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
