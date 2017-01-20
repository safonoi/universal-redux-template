import * as ActionType from 'actions/PATH_PREFIX/COMPONENT_NAME';

const defaultState = {};

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'case':
      return 'dummy';

    default:
      return state;
  }
};
