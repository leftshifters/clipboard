import React from 'react'; // eslint-disable-line no-unused-vars
import classNames from 'classnames';

class Container {
  render() {
    return (<div {...this.props} className={classNames(this.props.className, 'container')}>{this.props.children}</div>);
  }
}

export default Container;
