/* eslint global-require: 0 */

import Express from 'express';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { useRouterHistory, RouterContext, match } from 'react-router';
import { createMemoryHistory, useQueries } from 'history';
import compression from 'compression';
import Promise from 'bluebird';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';

import configureStore from '../store/configureStore';
import createRoutes from '../routes/index';

const server = new Express();
process.env.ON_SERVER = true;
const port = process.env.PORT || 3000;
let scriptSrcs = null;
let styleSrc = null;

if (process.env.NODE_ENV === 'production') {
  const refManifest = require('../../rev-manifest.json');

  scriptSrcs = [
    `/${refManifest['vendor.js']}`,
    `/${refManifest['app.js']}`
  ];
  styleSrc = `/${refManifest['main.css']}`;
} else {
  scriptSrcs = [
    'http://localhost:3001/static/vendor.js',
    'http://localhost:3001/static/dev.js',
    'http://localhost:3001/static/app.js'
  ];
  styleSrc = '/main.css';
}

server.use(compression());

if (process.env.NODE_ENV === 'production') {
  server.use(Express.static(path.join(__dirname, '../..', 'public')));
} else {
  server.use('/assets', Express.static(path.join(__dirname, '..', 'assets')));
  server.use(Express.static(path.join(__dirname, '../..', 'dist')));
}

server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');

// mock apis
server.get('/api/questions', (req, res) => {
  const { questions } = require('./mock_api');
  res.send(questions);
});

server.get('/api/users/:id', (req, res) => {
  const { getUser } = require('./mock_api');
  res.send(getUser(req.params.id));
});

server.get('/api/questions/:id', (req, res) => {
  const { getQuestion } = require('./mock_api');
  const question = getQuestion(req.params.id);
  if (question) {
    res.send(question);
  } else {
    res.status(404).send({ reason: 'question not found' });
  }
});

function getReduxPromise({ renderProps, store, history }) {
  const { query, params } = renderProps;
  const comp = renderProps.components[renderProps.components.length - 1].WrappedComponent;
  const promise = comp.fetchData ?
    comp.fetchData({ query, params, store, history }) :
    Promise.resolve();

  return promise;
}

function subscribeUrl({ location, history }) {
  let currentUrl = location.pathname + location.search;
  const unsubscribe = history.listen((newLoc) => {
    if (newLoc.action === 'PUSH' || newLoc.action === 'REPLACE') {
      currentUrl = newLoc.pathname + newLoc.search;
    }
  });

  return [
    () => currentUrl,
    unsubscribe
  ];
}

server.get('*', (req, res, next) => {
  const history = useRouterHistory(useQueries(createMemoryHistory))();
  const store = configureStore();
  const routes = createRoutes(history);
  const location = history.createLocation(req.url);

  match({ routes, location }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(301, redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      res.status(500).send(error.message);
    } else if (renderProps == null) {
      res.status(404).send('Not found');
    } else {
      const [getCurrentUrl, unsubscribe] = subscribeUrl({ location, history });
      const reqUrl = location.pathname + location.search;

      getReduxPromise({ renderProps, store, history })
        .then(() => {
          const reduxState = escape(JSON.stringify(store.getState()));
          const html = ReactDOMServer.renderToString(
            <Provider store={store}>
              { <RouterContext {...renderProps} /> }
            </Provider>
          );
          const metaHeader = Helmet.rewind();

          if (getCurrentUrl() === reqUrl) {
            res.render('index', { metaHeader, html, scriptSrcs, reduxState, styleSrc });
          } else {
            res.redirect(302, getCurrentUrl());
          }

          unsubscribe();
        })
        .catch((err) => {
          Helmet.rewind();
          unsubscribe();
          next(err);
        });
    }
  });
});

server.use((err, req, res) => {
  console.log(err.stack);
  // TODO report error here or do some further handlings
  res.status(500).send('something went wrong...');
});

console.log(`Server is listening to port: ${port}`);
server.listen(port);
