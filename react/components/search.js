'use strict';

var React = require('react');
var request = require('superagent');

var SearchBar = React.createClass({
  render: function() {
    return (
      <form action="/" class="search-form form-inline">
        <div class="form-group">
          <div class="input-group">
            <input name="q" type="search" placeholder="search" value="undefined" class="form-control js-search-input"/><span class="input-group-btn">
            <button type="submit" class="btn btn-default disabled"><span class="glyphicon search-icon undefined"></span></button></span>
          </div>
        </div>
      </form>
    );
  }
});

module.exports = SearchBar;