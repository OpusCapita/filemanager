const UPDATE_LAYOUT_PROPERTY = 'file-manager/download/UPDATE_PROPERTY';

const initialState = {
  multipleDownloadFileName: 'oc-files',
  maxUploadSize: 300000 // bytes
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_PROPERTY:
      return Object.assign({}, state, { [action.key]: action.value });
    default:
      return state;
  }
}

export function updateViewportProperty(key, value) {
  return { type: UPDATE_LAYOUT_PROPERTY, key, value };
}
