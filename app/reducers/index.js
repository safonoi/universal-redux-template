import { combineReducers } from 'redux';
import questions from './questions';
import questionDetail from './questionDetail';

const rootReducer = combineReducers({
  questions,
  questionDetail,
});

export default rootReducer;
