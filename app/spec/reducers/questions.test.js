import questionReducer from '../../reducers/questions';
import * as ActionType from '../../actions/questions';

describe('Reducer::Question', () => {
  it('returns an empty array as default state', () => {
    const action = { type: 'unknown' };
    const newState = questionReducer(undefined, action);
    expect(newState.toJS()).to.deep.equal([]);
  });

  describe('on LOADED_QUESTIONS', () => {
    it('returns the `response` in given action', () => {
      const action = {
        type: ActionType.LOADED_QUESTIONS,
        response: { responseKey: 'responseVal' }
      };
      const newState = questionReducer(undefined, action);
      expect(newState.toJS()).to.deep.equal(action.response);
    });
  });
});
