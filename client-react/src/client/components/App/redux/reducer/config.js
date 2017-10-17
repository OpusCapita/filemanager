const UPDATE_PROPERTY = 'file-manager/config/UPDATE_PROPERTY';
const LOAD = 'file-manager/config/LOAD';
const LOAD_SUCCESS = 'file-manager/config/LOAD_SUCCESS';
const LOAD_FAIL = 'file-manager/config/LOAD_FAIL';

const initialState = {
  loading: false,
  loaded: false,
  error: false,
  apiEndpoint: 'http://dev.opuscapita.com/api/file-manager'
  // endpoints: {
  //   fileEditors: '/file-editors',
  //   fileIcons: '/file-icons',
  //   archive: '/compression'
  // }
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return { ...state, loading: true };
    case LOAD_SUCCESS:
      return {
        ...state, 
        meta: { ...action.value },
        loading: false,
        loaded: true,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state, 
        loading: false,
        loaded: false,
        error: action.error
      };
      return { ...state, loading: false, loaded: false, error: action.error };
    default:
      return state;
  }
}

export function loadSuccess(value) {
  return { type: LOAD_SUCCESS, value };
}

export function loadFail(error) {
  return { type: LOAD_FAIL, error };
}

export function load(apiEndpoint) {
  return dispatch =>
    request.get(apiEndpoint)
    .then((result) => {
        dispatch(loadSuccess(result.body.meta));

        dispatch(replaceTransitions(result.body.data.transitions));
                dispatch(replaceStateNodes(result.body.data.states));
      })
      .catch((error) => {
        dispatch(loadFsmFail(error));
      });
}
