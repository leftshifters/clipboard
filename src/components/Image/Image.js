import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import Styles from './Image.less';
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars

@withStyles(Styles)
class Image {
  static propTypes = {
    clip: PropTypes.object,
    base64: PropTypes.string
  };

  render () {
    let clip = this.props.clip;
    let imgSrc = this.props.base64;

    if(clip) {
      let imgUrl = clip.relativePathShort;
      let divStyle = {
        backgroundImage: `url('../${imgUrl}')`
      };
      return (
        <div style={divStyle} className='fixed-image'></div>
      );
    } else {
      return (
        <div className='fixed-image' src={imgSrc}></div>
      );
    }
  }
}

export default Image;
