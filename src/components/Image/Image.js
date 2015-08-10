import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars

class Image {
  static propTypes = {
    clip: PropTypes.object
  };

  render () {
    let imgUrl = 'https://s3.amazonaws.com/boxtastic/logos/Screen+Shot+2015-07-23+at+7.00.49+pm.png';
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
