'use strict';

var React = require('react');

var uploadButton = React.createClass({
  render: function() {
    return {
      <div class="form-group extra-margin">
        <button type="button" class="btn btn-default btn-block btn-select">Select a file</button>
      </div>
    };
  }
});

module.exports = uploadButton;