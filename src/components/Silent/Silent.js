import React, {PropTypes} from 'react';// eslint-disable-line no-unused-vars
import debug from 'debug';
import FileStore from '../../stores/FileStore';
import ClipModal from '../Modal';

const log = debug('clipboard:silent');

class Silent extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = getStateFromStore();
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  getStateFromStore() {
    this.setState({
      index: 0
    });
  }

  onStoreChange() {
    log('Store change %o', this.state.files);
    this.setState(this.getStateFromStore());
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
        <ClipModal refs="modal" file={this.state.file} />
      </div>
    );
  }
}
