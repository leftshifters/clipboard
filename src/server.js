/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel/polyfill';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import express from 'express';
// import React from 'react';
import './core/Dispatcher';
// import App from './components/App';
import bodyParser from 'body-parser';
import apiRoutes from './api/routes';
import reqstore from 'reqstore';
import bootcheck from '../lib/bootcheck';
import disksize from '../lib/disksize';

console.log(apiRoutes);

// const version = '0.0.8';
const server = express();

server.enable('trust proxy');
server.set('port', (process.env.PORT || 3001));
server.use(express.static(path.join(__dirname)));
server.use(express.compress());
server.use(express.favicon());
server.use(express.json());
server.use(express.urlencoded());
server.use(express.methodOverride());
server.use(bodyParser.json());
server.use(reqstore());
server.use('/api', apiRoutes);

// developement mode
//
if (server.get('env') === 'development') {
  server.use(express.errorHandler());
  server.use(express.logger('dev'));
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
});

server.get('*', async (req, res, next) => {
  try {
    let notFound = false;
    let css = [];
    let data = {description: ''};
    // let app = <App
    //   path={req.path}
    //   version={version}
    //   context={{
    //     onInsertCss: value => css.push(value),
    //     onSetMeta: (key, value) => data[key] = value,
    //     onPageNotFound: () => notFound = true
    //   }} />;

    // data.body = React.renderToString(app);
    data.css = css.join('');
    data.size = size;
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
