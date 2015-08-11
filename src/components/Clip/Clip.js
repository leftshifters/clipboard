import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import Image from '../Image';
import Button from '../Button';
import Extention from '../Extention';


class Clip extends React.Component {
  static propTypes = {
    clip: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      removeButton: 'cog js-remove hide',
      editButton: 'hide',
      editClick: false
    };
  }

  onMouseEnter(e) {
    e.preventDefault();
    this.setState({
      removeButton: 'cog js-remove',
      editButton: 'block'
    });
  }

  onMouseLeave(e) {
    e.preventDefault();
    this.setState({
      removeButton: 'cog js-remove hide',
      editButton: this.state.editClick ? '' : 'hide'
    });
  }

  onEditButtonClick(e) {
    e.preventDefault();
    this.setState({
      editClick: true
    });
  }

  render () {
    let editButtonClass = 'js-edit-button btn btn-default btn-xs ' + this.state.editButton;
    let clip = this.props.clip;
    let id = clip._id; // eslint-disable-line no-underscore-dangle
    let thumb = '';

    if(clip.type === 'image') {
      thumb = <Image clip={clip} />;
    } else {
      thumb = <Extention clip={clip} />;
    }

    return (
      <div
        className="col-lg-3 col-xs-12 col-md-4 col-sm-6 item-row"
        key={id}
        onMouseEnter={this.onMouseEnter.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
        ref="parentdiv">
        <div data-id={id} className="item js-item">
          <div className="item-overlay hide"></div>
          <span className={this.state.removeButton}>
            <span className="cog-inner remove">
              <span className="glyphicon glyphicon-remove-circle remove-circle"></span>
            </span>
          </span>
          <a href={clip.detailUrl} className="link">
            <div className="item-inner">
              {thumb}
            </div>
          </a>
          <div className="title-block">
            <span className="title">
              <a title={clip.originalName} href={clip.url} className="item-link js-item-link">{clip.name}</a>
            </span>
            <div className="btn-group pull-right">
              <Button
                type="button"
                className={editButtonClass}
                onClick={this.onEditButtonClick.bind(this)}
                buttonFor=<span className="glyphicon glyphicon-pencil"></span> />
            </div>
            <div>
              <span className="small timeago-text">3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Clip;
