import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import NotificationSystem from 'react-notification-system';
import debug from 'debug';

const log = debug('clipboard:notofy');

class Notify extends React.Component {
  constructor() {
    super();
    this._notificationSystem = null;
    this.state = {
      notify: false,
      message: '',
      level: ''
    };
  }

  componantDidMount() {
    this._notificationSystem = this.refs.clipnotify;
  }

  render () {
    return (
      <div>
        <NotificationSystem ref='clipnotify' />
      </div>
    );
  }
}

export default Notify;
