import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import withStyles from '../../decorators/withStyles'; // eslint-disable-line no-unused-vars
import Styles from './Progressbar.less'; // eslint-disable-line no-unused-vars
import ProgressStore from '../../stores/ProgressStore';
import debug from 'debug';

const log = debug('clipboard:progressbar');

@withStyles(Styles)
class Progressbar extends React.Component {
  static propTypes = {
    r: 50,
    strokeWidth: 1
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      percentage: 0,
      r: this.props.r - this.props.strokeWidth / 2
    };
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  componentDidMount() {
    log('Componant mounted');
    ProgressStore.addChangeListener(this.onStoreChange);
  }

  componentWillUnmount() {
    log('Componant unmounted');
    ProgressStore.removeChangeListener(this.onStoreChange);
  }

  onStoreChange() {
    this.setState({
      percentage: ProgressStore.progress
    });
  }

  render() {
    let width = this.props.r * 2;
    let height = this.props.r * 2;
    let viewBox = `0 0 ${width} ${height}`;
    let dashArray = this.state.r * Math.PI * 2;
    let dashOffset = dashArray - dashArray * this.state.percentage / 100;

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
                textAnchor='middle'>{this.state.percentage + '%'}</text>
      </svg>
    );
  }
}

export default Progressbar;
