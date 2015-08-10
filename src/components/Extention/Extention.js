import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars

class Extention {
  static propTypes = {
    clip: PropTypes.object
  };

  render () {
    let clip = this.props.clip;
    return (
      <div className="unknown"><div className="file-block"><div>{clip.type}</div></div></div>
    );
  }
}

export default Extention;
