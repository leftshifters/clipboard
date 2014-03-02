
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var upload = require('./routes/upload');
var bootcheck = require('./lib/bootcheck');
var http = require('http');
var path = require('path');
var reqstore = require('reqstore');
var version = require('./package').version;


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('version', version);
app.set('uploadpath', 'public/uploads');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(reqstore());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.locals({
  version: version
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/page/:page', routes.page, routes.index);
app.get('/users', user.list);

app.put('/v1/items/:id', routes.validateId, routes.validateName, routes.editItem);
app.delete('/v1/items/:id', routes.validateId, routes.deleteItem);

app.post('/upload', upload.upload, upload.thumb, upload.done);

bootcheck();

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});