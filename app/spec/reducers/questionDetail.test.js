import Immutable from 'immutable';
import reducer from '../../reducers/questionDetail';
import * as ActionType from '../../actions/questions';

describe('Reducer::::QuestionDetail', () => {
  describe('on ACTION_TYPE', () => {
    describe('on LOADED_QUESTION_DETAIL', () => {
      it('merges state to response', () => {
        const action = {
          type: ActionType.LOADED_QUESTION_DETAIL,
          response: { key: 'val' }
        };

        const newState = reducer(undefined, action);

        expect(newState.toJS()).to.deep.equal({ user: {}, key: 'val' });
      });
    });

    describe('on LOADED_QUESTION_USER', () => {
      it('merge `user` to state', () => {
        const action = {
          type: ActionType.LOADED_QUESTION_USER,
          response: { key: 'val' }
        };

        const initState = Immutable.fromJS({
          id: 'the-question-id',
          user: {}
        });

        const newState = reducer(initState, action);

        expect(newState.toJS()).to.deep.equal({
          id: 'the-question-id',
          user: {
            key: 'val'
          }
        });
      });
    });
  });
});
