const UPDATE_LAYOUT_PROPERTY = 'file-manager/layout/UPDATE_PROPERTY';

const initialState = {
  dateTimeFormat: 'yyyy-MM-dd HH:mm:ss',
  error: false,
  loaded: false,
  loading: false,
  locale: 'en',
  readOnly: false,
  showAddressBar: true,
  showContextMenu: true,
  showDirectoriesSize: true,
  showExtensionIcons: true,
  showFileActions: true,
  showTreeView: false,
  splitView: false,
  humanReadableFileSize: true
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
