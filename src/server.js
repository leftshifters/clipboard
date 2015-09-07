/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel/polyfill';
import _ from 'lodash';
import logger from 'morgan';
import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import reqstore from 'reqstore';
import methodOverride from 'method-override';
import './core/Dispatcher';
import bootcheck from '../lib/bootcheck';
import upload from '../routes/upload';
import routes from '../routes';
import clip from '../routes/clip';

const pack = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);
const server = express();

process.title = 'Clipboard';

server.enable('trust proxy');
server.set('port', (process.env.PORT || 3001));
server.set('uploadpath', '../public/uploads');

if(server.get('env') === 'developement') {
  server.use(logger('tiny'));
}

server.use(logger('common'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
  extended: true
}));
server.use(reqstore());
server.use(compression());
server.use(express.static(path.join(__dirname)));
server.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
server.use(methodOverride());
server.set('views', path.join(__dirname, '../views'));
server.set('view engine', 'jade');

// developement mode
//
if (server.get('env') === 'development') {
  server.use(express.errorHandler());
  server.use(logger('dev'));
}

// The top-level React component + HTML template for it
const templateFile = path.join(__dirname, 'templates/index.html');
const template = _.template(fs.readFileSync(templateFile, 'utf8'));
let size = '';

bootcheck();

// get clips
//
server.get('/api/clips/:page', routes.page, routes.index);
server.post('/api/clip/:id', [
  routes.validateId,
  routes.validateName,
  routes.editItem,
  routes.updateSearchIndex,
  routes.ok
]);

server.put('/api/clip/upload', [
  upload.upload,
  upload.thumb,
  upload.diskspace,
  upload.addSearchIndex,
  routes.ok
]);

server.delete('/api/clip/:id', [
  routes.validateId,
  routes.deleteItem,
  upload.diskspace,
  routes.removeSearchIndex,
  routes.ok
]);

server.get('/reindex', routes.reindex);
server.get('/api/clipd/:hash/:name?', [
  clip.fetch,
  routes.detail,
  clip.qr,
  routes.ok
]);

server.get('/clip/:hash/:name?', clip.fetch, clip.send);
server.get('/8b66041e096772f9c0c3c4adb2f625ab.txt', routes.text);
server.get('/changelog', routes.changelog);
server.get('/reindex', routes.reindex);

server.get('*', async (err, req, res, next) => {
  if(!err) {
    return next();
  }

  // logging error here
  return res.json({
    error: err.message || err
  });
});

server.get('*', async (req, res, next) => {
  try {
    let notFound = false;
    let data = {
      size: size,
      version: pack.version
    };
    let html = template(data);

    if (notFound) {
      res.status(404);
    }

    res.send(html);
  } catch (err) {
    next(err);
  }
});

//
// Launch the server
// -----------------------------------------------------------------------------

server.listen(server.get('port'), () => {
  if (process.send) {
    process.send('online');
  } else {
    console.log('The server is running at http://localhost:' + server.get('port'));
  }
});
