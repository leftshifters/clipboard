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
import debug from 'debug';
import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';

import './core/Dispatcher';
import bootcheck from '../lib/bootcheck';
import upload from '../routes/upload';
import routes from '../routes';
import clip from '../routes/clip';

import passport from 'passport';
var GoogleStrategy = require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const pack = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);
const log = debug('clipboard:server');
const server = express();

process.title = 'Clipboard';

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOST + '/auth/google/callback',
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      if((profile._json.domain === 'leftshift.io' || profile._json.domain === 'vxtindia.com') && profile.isPerson) { // eslint-disable-line no-underscore-dangle
        profile.accessToken = accessToken;
        return done(null, profile);
      } else {
        return done(new Error('Unauthorized'));
      }
    });
  }
));


server.enable('trust proxy');
server.set('port', (process.env.PORT || 3001));
server.set('uploadpath', '../public/uploads');

if(server.get('env') === 'developement') {
  server.use(logger('tiny'));
}

server.use(logger('common'));
server.use(bodyParser.json());
server.use(cookieParser());
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
server.use(cookieSession({
    secret: 'KD4U454WjxPGfLgX7Mr6',
    cookie: {
      maxage: 60000
    }
  })
);
server.use(passport.initialize());
server.use(passport.session());

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

server.get('/', routes.checkLogin);
server.get('/clipd/:hash/:name?', routes.checkLogin, routes.checkLogin);

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

server.get('/api/clipd/:hash/:name?', [
  clip.fetch,
  routes.detail,
  clip.qr,
  routes.ok
]);

server.get('/clip/:hash/:name?', routes.checkLogin, clip.fetch, clip.send);
server.get('/8b66041e096772f9c0c3c4adb2f625ab.txt', routes.text);
server.get('/changelog', routes.changelog);
server.get('/reindex', routes.checkLogin, routes.reindex);

// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
//
server.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// the callback after google has authenticated the user
server.get('/auth/google/callback', routes.oAuthCallback);

server.get('*', async (err, req, res, next) => {
  if(!err) {
    return next();
  }

  log('Got error ' + err);

  // logging error here
  return res.status(err.code || 500).json({
    error: err
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
