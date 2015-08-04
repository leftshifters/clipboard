'use strict';

var React = require('react');

var NumberBox = React.createClass({
  render: function() {
    return (
      <div class="form-group extra-margin">
        <label for="name"><span>Name</span><span class="color-9a"><small><em> (optional)</em></small></span></label>
        <input type="text" name="name" id="name" placeholder="clipboard" class="form-control"/>
      </div>
    );
  }
});

module.exports = NumberBox;