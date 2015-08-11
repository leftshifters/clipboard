import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import Styles from './Clips.less'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars

import Clip from '../Clip';

@withStyles(Styles)
class Clips extends React.Component {
  static propTypes = {
    clips: PropTypes.array
  };

  get clips() {

    if(!this.props.clips) {
      return '';
    }

    if(!this.props.clips.length) {
      return ('');
    }

    let clips = [];

    this.props.clips.map((clip, key) => {
      clips.push(
        <Clip key={key} clip={clip} />
      );
    });

    return clips;
  }

  render() {
    return (
      <div className="clips">
        {this.clips}
      </div>
    );
  }
}

export default Clips;
