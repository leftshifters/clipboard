/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import emptyFunction from '../../node_modules/react/lib/emptyFunction';

function withContext(ComposedComponent) {
  return class WithContext {

    static propTypes = {
      context: PropTypes.shape({
        onInsertCss: PropTypes.func,
        onSetMeta: PropTypes.func,
        onPageNotFound: PropTypes.func
      })
    };

    static childContextTypes = {
      onInsertCss: PropTypes.func.isRequired,
      onSetMeta: PropTypes.func.isRequired,
      onPageNotFound: PropTypes.func.isRequired
    };

    getChildContext() {
      let context = this.props.context;
      return {
        onInsertCss: context.onInsertCss || emptyFunction,
        onSetMeta: context.onSetMeta || emptyFunction,
        onPageNotFound: context.onPageNotFound || emptyFunction
      };
    }

    render() {
      let { context, ...other } = this.props; // eslint-disable-line no-unused-vars
      return <ComposedComponent {...other} />;
    }

  };
}

export default withContext;
