import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import NotificationSystem from 'react-notification-system';
import ResponseStore from '../../stores/ResponseStore';
import debug from 'debug';

const log = debug('clipboard:notofy');

class Notify extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.notificationSystem = null;
    this.state = this.getStateFromStore();
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  getStateFromStore() {
    return {
      error: ResponseStore.error || null,
      success: ResponseStore.success || null
    };
  }

  addNotification() {
    this.notificationSystem.addNotification({
      message: this.state.error ? this.state.error.message : this.state.success,
      level: this.state.error ? 'error' : 'success',
      autoDismiss: 5
    });
  }

  onStoreChange() {
    log('Store change hit %o', ResponseStore);
    this.setState(this.getStateFromStore());
    this.addNotification();
  }

  componentDidMount() {
    this.notificationSystem = this.refs.clipnotify;
    ResponseStore.addChangeListener(this.onStoreChange);
  }

  componentWillUnmount() {
    ResponseStore.removeChangeListener(this.onStoreChange);
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
