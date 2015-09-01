import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import Styles from './ClipDetail.less'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
// import Row from '../Row';
import Loader from '../Loader';
import debug from 'debug';

const log = debug('clipboard:clipdetail');

@withStyles(Styles)
class ClipDetail extends React.Component {
  static propTypes = {
    clip: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: true
    };
  }

  render() {
    // let clip = this.props.clip;
    log('rendering clip detail page');
    return (
      <Loader loading={this.state.loading} />
    );
  }
}

export default ClipDetail;
