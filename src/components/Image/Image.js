import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars

class Image {
  static propTypes = {
    clip: PropTypes.object
  };

  render () {
    let clip = this.props.clip;
    let imgUrl = '../' + clip.relativePathLong;
    let divStyle = {
      backgroundImage: 'url(' + imgUrl + ')'
    };

    return (
      <div
        style={divStyle} className="fixed-image"></div>
    );
  }
}

export default Image;
