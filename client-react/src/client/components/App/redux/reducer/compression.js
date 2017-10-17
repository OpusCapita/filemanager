const UPDATE_ARCHIVE_PROPERTY = 'file-manager/archive/UPDATE_ARCHIVE_PROPERTY';

const initialState = {
  compressedFilesPattern: /\.(gz|tar|rar|g?zip)$/i
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_ARCHIVE_PROPERTY:
      return Object.assign({}, state, { [action.key]: action.value });
    default:
      return state;
  }
}

export function updateViewportProperty(key, value) {
  return { type: UPDATE_ARCHIVE_PROPERTY, key, value };
}
