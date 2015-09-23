import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import Styles from './Extention.less';

@withStyles(Styles)
class Extention {
  static propTypes = {
    clip: PropTypes.object,
    ext: PropTypes.string
  };

  render () {
    let clip = this.props.clip;
    let ext = this.props.ext;
    let type = !clip ? ext : clip.type;
    let clazz = 'file-block ';

    if(type.length > 4) {
      type = 'FILE';
    }

    switch(type) {
      case 'pdf':
        clazz += 'file-red';
        break;
      case 'ipa':
        clazz += 'file-blue';
        break;
      case 'apk':
        clazz += 'file-green';
        break;
      case 'psd':
        clazz += 'file-gray';
        break;
      case 'ai':
        clazz += 'file-orange';
        break;
      default:
        clazz += 'file-common';
        break;
    }

    return (
      <div className="unknown"><div className={clazz}><div>{type}</div></div></div>
    );
  }
}

export default Extention;
