import Immutable from 'immutable';
import * as ActionType from '../actions/questions';

const defaultState = Immutable.fromJS({
  user: {}
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case ActionType.LOADED_QUESTION_DETAIL:
      return state.merge(action.response);

    case ActionType.LOADED_QUESTION_USER:
      return state.merge({ user: action.response });

    default:
      return state;
  }
};
