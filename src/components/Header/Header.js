import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import styles from './Header.less'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import SearchForm from '../SearchForm';
import UploadBox from '../UploadBox';
import HeaderStore from '../../stores/HeaderStore';
import pack, { version } from '../../../package.json'; // eslint-disable-line no-unused-vars
import Row from '../Row';
import debug from 'debug';

const log = debug('clipboard:header');

@withStyles(styles)
class Header extends React.Component {

  static PropTypes = {
    query: PropTypes.string
  }

  constructor(props, context) {
    super(props, context);
    this.state = this.getStateFromStore();
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  getStateFromStore() {
    let pagination = HeaderStore.pages;
    pagination = pagination ? pagination[0] || pagination : null;
    log('Pagination is %o', pagination);
    return {
      prevPage: pagination ? pagination.leftArrow : 'invisible',
      prevPageLink: pagination ?
        (
          (
            !pagination.prevPageLink ||
            pagination.page === 0 ||
            pagination.page === 1
          )
          ? '/' :
          `/${pagination.prevPageLink}`
        ) :
        '/',
      nextPage: pagination ? pagination.rightArrow : 'invisible',
      nextPageLink: pagination ? `/${pagination.nextPageLink}` : '/'
    };
  }

  onStoreChange() {
    log('State change and render view');
    log('Store change %o', arguments);
    this.setState(this.getStateFromStore());
  }

  componentDidMount() {
    this.version = version;
    HeaderStore.addChangeListener(this.onStoreChange);
  }

  componentWillUnmount() {
    HeaderStore.removeChangeListener(this.onStoreChange);
  }

  get SearchForm() {
    return (
      <div className = "col-md-4">
        <h1>
          <SearchForm query = { this.props.query } />
        </h1>
      </div>
    );
  }

  render() {
    let prevPage = 'page prev-page ' + this.state.prevPage;
    let nextPage = 'page next-page ' + this.state.nextPage;
    //invisible

    log(this.state);
    return (
      <Row>
        <div className = "col-md-4">
          <h1>
            <a href = "/" className = "head-logo"> Clipboard </a>
            <span className = "small"> {this.version} </span>
          </h1 >
        </div>

        { this.SearchForm }

        <div className = "col-md-4">
          <UploadBox />
          <h1>
            <div className = "pages pull-right">
              <a href = { this.state.prevPageLink } className = { prevPage }>
                <span className = "glyphicon glyphicon-chevron-left"></span>
              </a>
              <a href = { this.state.nextPageLink } className = { nextPage}>
                <span className = "glyphicon glyphicon-chevron-right"></span>
              </a>
            </div>
          </h1>
        </div>
      </Row>
    );
  }
}

export default Header;
