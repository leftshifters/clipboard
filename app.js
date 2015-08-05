/**
 * New Relic
 */
if ('production' === process.env.NODE_ENV) {
  try {
    require('newrelic');
  } catch(e) {
    console.error('WARNING!');
    console.error('newrelic npm package is not installed.');
    console.error('run the following command to install it');
    console.error('npm install newrelic');
  }
}

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var clip = require('./routes/clip');
var upload = require('./routes/upload');
var bootcheck = require('./lib/bootcheck');
var disksize = require('./lib/disksize');
var http = require('http');
var path = require('path');
var reqstore = require('reqstore');
var debug = require('debug')('clipboard:app');
var version = require('./package').version;

var app = express();

// all environments
app.enable('trust proxy');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('version', version);
app.set('uploadpath', 'public/uploads');
app.use(express.compress());
app.use(express.favicon());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(reqstore());
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  app.use(express.logger('dev'));
}

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.locals({ version: version });

app.get('/', routes.index);
app.get('/changelog', routes.changelog);
app.get('/reindex', routes.reindex);
app.get('/page/:page', routes.page, routes.index);
app.get('/clip/:hash/:name?', clip.fetch, clip.send);
app.get('/clipd/:hash/:name?', clip.fetch, clip.qr, routes.detail);


app.post('/upload', upload.upload, upload.thumb, upload.diskspace, upload.addSearchIndex, routes.root);
app.get('/8b66041e096772f9c0c3c4adb2f625ab.txt', routes.detectify);

app.put('/v1/items/:id', routes.validateId, routes.validateName, routes.editItem, routes.updateSearchIndex, routes.ok);
app.delete('/v1/items/:id', routes.validateId, routes.deleteItem, upload.diskspace, routes.removeSearchIndex, routes.ok);

bootcheck();
disksize(function onsize(err, total, free) {
  if (err) {
    debug(err);
  }

  app.locals({ disksize: { total: total || 0, free: free || 0 } });
});

var server = http.createServer(app).listen(app.get('port'), function(){
  debug('Express server listening on port ' + app.get('port'));
});
