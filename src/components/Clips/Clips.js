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
    this.props.clips = [
      {
        '_id': '55c4a4cc80b05a4443a6b931',
        'hash': '9avme',
        'basename': '17220-74ottk.dmg',
        'basenameWithoutExt': '17220-74ottk',
        'extension': '.dmg',
        'originalName': 'jre-8u45-macosx-x64.dmg',
        'relativePathShort': 'uploads/17220-74ottk.dmg',
        'relativePathLong': 'public/uploads/17220-74ottk.dmg',
        'relativeThumbPathShort': '',
        'relativeThumbPathLong': '',
        'mime': 'application/x-apple-diskimage',
        'name': 'jre-8u45-macosx-x64.dmg',
        'type': 'dmg',
        'bundleId': '',
        'created': '2015-08-07T12:30:04.130Z',
        'createdms': 1438950604130,
        'url': 'http://localhost:3001/clip/17220-74ottk/jre-8u45-macosx-x64dmg',
        'detailUrl': 'http://localhost:3001/clipd/17220-74ottk/jre-8u45-macosx-x64dmg',
        'timeago': '3 days ago'
      },
      {
        '_id': '55c4a4bc80b05a4443a6b930',
        'hash': 'YerEd',
        'basename': '17220-7wyhls.jpg',
        'basenameWithoutExt': '17220-7wyhls',
        'extension': '.jpg',
        'originalName': 'powered by mojopay.jpg',
        'relativePathShort': 'uploads/17220-7wyhls.jpg',
        'relativePathLong': 'public/uploads/17220-7wyhls.jpg',
        'relativeThumbPathShort': '',
        'relativeThumbPathLong': '',
        'mime': 'image/jpeg',
        'name': 'powered by mojopay.jpg',
        'type': 'image',
        'bundleId': '',
        'created': '2015-08-07T12:29:48.108Z',
        'createdms': 1438950588108,
        'url': 'http://localhost:3001/clip/17220-7wyhls/powered-by-mojopayjpg',
        'detailUrl': 'http://localhost:3001/clipd/17220-7wyhls/powered-by-mojopayjpg',
        'imageurl': '../uploads/17220-7wyhls.jpg',
        'timeago': '3 days ago'
      }
    ];

    if(!this.props.clips) {
      return '';
    }

    if(!this.props.clips.length) {
      return ('');
    }

    let clips = [];

    this.props.clips.map((clip) => {
      clips.push(
        <Clip clip={clip} />
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
