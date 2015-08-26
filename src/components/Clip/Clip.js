import React, {PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import {defer} from 'underscore';
import _ from 'lodash';
import debug from 'debug';
import Image from '../Image';
import Button from '../Button';
import TextBox from '../TextBox';
import Extention from '../Extention';
import Progressbar from '../Progressbar';

const log = debug('clipboard:clip');

class Clip extends React.Component {
  static propTypes = {
    clip: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      removeButton: 'cog js-remove hide',
      editButton: 'hide',
      titleInput: 'hide',
      atitle: '',
      editClick: false,
      editClikCount: 0,
      editText: this.props.clip.name,
      uplaoding: this.props.clip.uploading ? true : false,
      percentage: 0
    };
    log('Clip initial state is %o', this.state);
  }

  handleSubmit() {
    let text = this.state.editText.trim();
    if(
      !_.isEmpty(this.state.editText) &&
      this.props.clip.name !== text
    ) {
      this.props.onEditSave(text);
    }
  }

  onMouseEnter(e) {
    e.preventDefault();
    this.setState({
      removeButton: 'cog ',
      editButton: this.state.editClick ? 'active' : ''
    });
    log('On Mouse enter: state change to %o', this.state);
  }

  onMouseLeave(e) {
    e.preventDefault();
    this.setState({
      removeButton: 'cog hide',
      editButton: this.state.editClick ? 'active' : 'hide'
    });
    log('On Mouse leave: state change to %o', this.state);
  }

  onEditButtonClick(e) {
    e.preventDefault();

    log('Edit button clicked');
    if(this.state.editClikCount === 0) {
      this.setState({
        editClikCount: 1,
        editClick: true,
        editButton: 'active',
        titleInput: 'block',
        atitle: 'hide'
      });
      let title = React.findDOMNode(this.refs.titleInput);
      defer(title.focus.bind(title));
    } else {
      this.setState({
        editClikCount: 0,
        editClick: false,
        titleInput: 'hide',
        atitle: 'block'
      });
    }
    log('On Edit button click: state is %o', this.state);
  }

  onTitleChange(e) {
    log('Clip title change to: %s', e.target.value);
    this.setState({editText: e.target.value});
  }

  componentDidMount() {
    let percent = 0;

    setInterval(() => {
      percent += 10;
      this.setState({
        percentage: percent
      });
    }, 1000);
  }

  render () {
    log('Rendering clip view');
    let editButtonClass = 'js-edit-button btn btn-default btn-xs ' + this.state.editButton;
    let titleInput = 'edit-name ' + this.state.titleInput;
    let aTitle = 'item-link ' + this.state.atitle;
    let clip = this.props.clip;
    let id = clip._id; // eslint-disable-line no-underscore-dangle
    let thumb = '';

    if(clip.uploading) {
       thumb = <Progressbar
        strokeWidth="5"
        r="40"
        percentage={this.state.percentage} />
    } else if(clip.type === 'image') {
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
              <span className="glyphicon glyphicon-remove-circle remove-circle"
                id={id}
                data-key={clip.id}
                onClick={this.props.onDestory}>
              </span>
            </span>
          </span>
          <a href={clip.detailUrl} className="link">
            <div className="item-inner">
              {thumb}
            </div>
          </a>
          <div className="title-block">
            <span className="title">
              <a title={clip.originalName} href={clip.url} className={aTitle}>{clip.name}</a>
              <TextBox
                className={titleInput}
                type="text"
                placeholder={clip.name}
                ref="titleInput"
                id={id}
                data-key={clip.id}
                onBlur={this.handleSubmit.bind(this)}
                onChange={this.onTitleChange.bind(this)} />
            </span>
            <div className="btn-group pull-right">
              <Button
                type="button"
                className={editButtonClass}
                onClick={this.onEditButtonClick.bind(this)}
                buttonFor=<span className="glyphicon glyphicon-pencil"></span> />
            </div>
            <div>
              <span className="small timeago-text">{clip.timeago}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Clip;
