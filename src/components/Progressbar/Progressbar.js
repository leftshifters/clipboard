import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import Styles from './Progressbar.less'; // eslint-disable-line no-unused-vars
import debug from 'debug';

const log = debug('clipboard:progressbar');

@withStyles(Styles)
class Progressbar extends React.Component {
  static propTypes = {
    r: 50,
    percentage: 50,
    strokeWidth: 1
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      percentage: parseInt(this.props.percentage, 10),
      r: this.props.r - this.props.strokeWidth / 2
    };
  }

  render() {
    let width = this.props.r * 2;
    let height = this.props.r * 2;
    let viewBox = `0 0 ${width} ${height}`;
    let dashArray = this.state.r * Math.PI * 2;
    let dashOffset = dashArray - dashArray * this.props.percentage / 100;
    log(dashOffset);

    return (
      <svg
        className='CircularProgress'
        width={this.props.r * 2}
        height={this.props.r * 2}
        viewBox={viewBox}>
        <circle
            className='CircularProgress-Bg'
            cx={this.props.r}
            cy={this.props.r}
            r={this.state.r}
            strokeWidth={this.props.strokeWidth + 'px'} />
        <circle
            className='CircularProgress-Fg'
            cx={this.props.r}
            cy={this.props.r}
            r={this.state.r}
            strokeWidth={this.props.strokeWidth + 'px'}
            transform={`rotate(-90 ${this.props.r} ${this.props.r})`}
            style={{
                strokeDasharray: dashArray,
                strokeDashoffset: dashOffset
            }} />
            <text
                className='CircularProgress-Text'
                x={this.props.r}
                y={this.props.r}
                dy='.4em'
                textAnchor='middle'>{this.props.percentage + '%'}</text>
      </svg>
    );
  }
}

export default Progressbar;
