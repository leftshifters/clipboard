import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars

const cssClassname = 'btn';

class Button {
  static PropTypes = {
    className: PropTypes.string,
    buttonFor: PropTypes.string
  };

  get ClassName() {
    return this.props.className ? cssClassname + ' ' + this.props.className : cssClassname;
  }

  get ButtonFor() {
    return this.props.buttonFor ? this.props.buttonFor : 'Do it!';
  }

  render() {
    return (<button {...this.props} className={this.ClassName}>{this.ButtonFor}</button>);
  }
}

export default Button;
