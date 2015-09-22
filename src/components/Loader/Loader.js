import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import Styles from './Loader.less'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
var Loder = require('halogen/RingLoader');

@withStyles(Styles)
class Loader extends React.Component {

  static propTypes = {
    loading: PropTypes.bool
  };

  render () {
    let claz = this.props.loading ? 'body-loader block' : 'body-loader hide';
    return (
      <div className={claz}>
        <Loder color="#222" size="42px" margin="5px" />
      </div>
    );
  }
}

export default Loader;
