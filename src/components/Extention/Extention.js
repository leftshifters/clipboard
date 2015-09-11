import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars

class Extention {
  static propTypes = {
    clip: PropTypes.object
  };

  render () {
    let clip = this.props.clip;
    let type = clip.type;
    if(clip.type.length > 4) {
      type = 'FILE';
    }
    return (
      <div className="unknown"><div className="file-block"><div>{type}</div></div></div>
    );
  }
}

export default Extention;
