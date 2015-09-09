import 'babel/polyfill';
import React from 'react';
import FastClick from 'fastclick';
// import Router from './Router';
import App from './components/App';
// import AppStore from './stores/AppStore';
import pack, {version} from '../package.json'; // eslint-disable-line no-unused-vars
import Router from 'react-router';
const Route = Router.Route;
import ClipApp from './components/ClipApp';
import ClipDetail from './components/ClipDetail';

function run() {
  var routes = (
    <Route handler={App}>
      <Route path='/' name="clipapp" handler={ClipApp} />
      <Route path='/page/:page' name="clip" handler={ClipApp} />
      <Route path='/clipd/:hash/:name?' name="clipDetails" handler={ClipDetail} />
    </Route>
  );

  Router.run(routes, Router.HistoryLocation, function (Handler) {
    let props = {
      version: version,
      context: {
        onSetTitle: value => document.title = value,
        onSetMeta: (name, content) => {
          // Remove and create a new <meta /> tag in order to make it work
          // with bookmarks in Safari
          let elements = document.getElementsByTagName('meta');
          [].slice.call(elements).forEach((element) => {
            if (element.getAttribute('name') === name) {
              element.parentNode.removeChild(element);
            }
          });
          let meta = document.createElement('meta');
          meta.setAttribute('name', name);
          meta.setAttribute('content', content);
          document.getElementsByTagName('head')[0].appendChild(meta);
        }
      }
    };

    let appElement = React.createElement(Handler, props);
    React.render(appElement, document.getElementById('clipapp'), () => {
      let css = document.getElementById('css');
      css.parentNode.removeChild(css);
    });
  });
}

// Run the application when both DOM is ready
// and page content is loaded
Promise.all([
  new Promise((resolve) => {
    if (window.addEventListener) {
      window.addEventListener('DOMContentLoaded', resolve);
    } else {
      window.attachEvent('onload', resolve);
    }
  }).then(() => FastClick.attach(document.body))
]).then(run);
