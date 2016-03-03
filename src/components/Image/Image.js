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
    let imgUrl = clip.mime === 'image/gif' ? clip.relativePathShort : clip.relativeThumbPathShort;
    console.log('Images are ', imgUrl);
    let divStyle = {
      backgroundImage: `url('../${imgUrl}')`
    };

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
