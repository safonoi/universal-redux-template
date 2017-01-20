import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import App from '../containers/App';
import Intro from '../containers/Intro';
import Questions from '../containers/Questions';
import Question from '../containers/Question';

export default history => (
  <Router history={history}>
    <Route path="/" component={App}>
      <Route path="questions" component={Questions} />
      <Route path="questions/:id" component={Question} />
      <IndexRoute component={Intro} />
    </Route>
  </Router>
);
