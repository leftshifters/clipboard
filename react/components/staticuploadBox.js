'use strict';

var React = require('react');
var UploadButton = require('./uploadButton');
var NameBox = require('./namebox');

var UploadBox = React.createClass({
  render: function() {
    return (
      <div class="col-lg-3 col-xs-12 col-md-4 col-sm-6 item-row">
        <div class="item add-dialog">
          <form role="form" method="post" action="/upload" enctype="multipart/form-data" class="upload-form">
            <uploadButton/>
            <NameBox/>
            <button type="submit" disabled="disabled" class="btn btn-primary btn-submit center-block btn-lg">Upload</button>
            <input type="file" name="content" class="input-file"/>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = UploadBox;