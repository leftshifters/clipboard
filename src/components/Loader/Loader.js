import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import Loading from 'react-loading';
import Styles from './Loader.less'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars

@withStyles(Styles)
class Loader extends React.Component {

  static propTypes = {
    loading: PropTypes.bool
  };

  render () {
    let claz = this.props.loading ? 'body-loader block' : 'body-loader hide';
    return (
      <div className={claz}>
        <Loading type="spin" color="#222" />
      </div>
    );
  }
}

export default Loader;
