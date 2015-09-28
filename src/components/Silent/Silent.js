import React, {PropTypes} from 'react';// eslint-disable-line no-unused-vars
import debug from 'debug';
import FileStore from '../../stores/FileStore';
import ClipModal from '../Modal';

const log = debug('clipboard:silent');

class Silent extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = this.getStateFromStore();
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  getStateFromStore() {
    return {
      files: FileStore.files || null
    };
  }

  onStoreChange() {
    this.setState(this.getStateFromStore());
    log('Store change %o', this.state.files);
  }

  componentDidMount() {
    log('Component mounted');
    FileStore.addChangeListener(this.onStoreChange);
  }

  componentWillUnmount() {
    log('Component unmounted');
    FileStore.removeChangeListener(this.onStoreChange);
  }

  render() {
    return (
      <div>
        <ClipModal refs="modal" files={this.state.files} />
      </div>
    );
  }
}

export default Silent;
