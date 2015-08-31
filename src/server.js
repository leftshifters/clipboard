/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel/polyfill';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import express from 'express';
import methodOverride from 'method-override';
import './core/Dispatcher';
import bodyParser from 'body-parser';
import compression from 'compression';
import reqstore from 'reqstore';
import bootcheck from '../lib/bootcheck';
import disksize from '../lib/disksize';
import upload from '../routes/upload';
import logger from 'morgan';
import routes from '../routes';

const pack = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);
const server = express();

process.title = 'Clipboard';

server.enable('trust proxy');
server.set('port', (process.env.PORT || 3001));
server.set('uploadpath', '../uploads');

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
server.use('/uploads', express.static(path.join(__dirname, '../uploads')));
server.use(methodOverride());

console.log(path.join(__dirname, '../uploads'));
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
disksize(function onsize(total, free) {
  size = {
    total: total,
    free: free
  };
  server.locals({ disksize: { total: total, free: free } });
});

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
  routes.root
]);

server.delete('/api/clip/:id', [
  routes.validateId,
  routes.deleteItem,
  upload.diskspace,
  routes.removeSearchIndex,
  routes.ok
]);

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
