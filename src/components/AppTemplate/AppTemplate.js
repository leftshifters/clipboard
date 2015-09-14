import debug from 'debug';
import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import Notify from '../Notify';

const log = debug('clipboard:apptemplate');

class AppTemplate {

  render() {
    log('App start: rendering first view');
    return (
      <div>
        <Notify />
        {this.props.children}
      </div>
    );
  }
}

export default AppTemplate;
