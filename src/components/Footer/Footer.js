import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import styles from '../Header/Header.less'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import HeaderStore from '../../stores/HeaderStore';
import AppActions from '../../actions/AppActions';
import ClipActions from '../../actions/ClipActions';
import Row from '../Row';
import debug from 'debug';
import _ from 'lodash';

const log = debug('clipboard:header');

// @withContext
@withStyles(styles)
class Footer extends React.Component {

  static PropTypes = {
    version: PropTypes.string
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
      prevLink: pagination && pagination.prevPageLink ? pagination.prevPageLink : '/',
      nextPage: pagination ? pagination.rightArrow : 'invisible',
      nextLink: pagination && pagination.nextPageLink ? pagination.nextPageLink : '/'
    };
  }

  onStoreChange() {
    log('State change and render view');
    log('Store change %o', arguments);
    this.setState(this.getStateFromStore());
  }

  componentDidMount() {
    HeaderStore.addChangeListener(this.onStoreChange);
  }

  componentWillUnmount() {
    HeaderStore.removeChangeListener(this.onStoreChange);
  }

  getPageNumber(link) {
    let page = link.split('/').pop();
    log('Page is %s', page);
    if(!_.isNaN(_.parseInt(page))) {
      return _.parseInt(page);
    } else {
      return 0;
    }
  }

  prevLink(e) {
    e.preventDefault();
    log('Previous link is %s', this.state.prevLink);
    if(this.state.prevLink === 'page/0' || this.state.prevLink === 'page/1') {
      AppActions.navigateTo('/');
    } else {
      AppActions.navigateTo('/' + this.state.prevLink);
    }
    log('Page count is %s', this.getPageNumber(this.state.prevLink));
    ClipActions.getClips(this.getPageNumber(this.state.prevLink));
  }

  nextLink(e) {
    e.preventDefault();
    log('Next link is %s', this.state.nextLink);
    AppActions.navigateTo('/' + this.state.nextLink);
    ClipActions.getClips(this.getPageNumber(this.state.nextLink));
  }

  render() {
    let prevPage = 'page prev-page ' + this.state.prevPage;
    let nextPage = 'page next-page ' + this.state.nextPage;
    //invisible

    return (
      <Row>
        <div className="col-md-8">
          <div className="pull-left memory">
            <span className="lead">413.11gb</span>
          </div>
        </div>
        <div className="col-md-4">
          <h1>
            <div className="pages pull-right">
              <a href='#' onClick={this.prevLink.bind(this)} className={prevPage}>
                <span className="glyphicon glyphicon-chevron-left"></span>
              </a>
              <a href='#' onClick={this.nextLink.bind(this)} className={nextPage}>
                <span className="glyphicon glyphicon-chevron-right"></span>
              </a>
            </div>
          </h1>
        </div>
      </Row>
    );
  }
}

export default Footer;
