const UPDATE_FILE_EDITORS_PROPERTY = 'file-manager/file-editors/UPDATE_FILE_EDITORS_PROPERTY';

const editablePatterns = {
  plainMarkdown: {
    pattern: /\.(md)/i,
    component: '@opuscapita/react-markdown@latest/MarkdownInput',
    componentProperties: {}
  },
  plainText: {
    pattern: /\.(txt)/i,
    component: '@opuscapita/react-text-editors@2.1.5/PlainTextEditor',
    componentProperties: {}
  },
  codeHtml: {
    pattern: /\.(htm|html)/i,
    component: '@opuscapita/react-code-editor@2.1.5/CodeEditor',
    componentProperties: { syntax: 'html' }
  },
  codeGsp: {
    pattern: /\.(gsp)/i,
    component: '@opuscapita/react-code-editor@1.2.5/CodeEditor',
    componentProperties: { syntax: 'gsp' }
  }
};

const initialState = {
  editablePatterns
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_FILE_EDITORS_PROPERTY:
      return Object.assign({}, state, { [action.key]: action.value });
    default:
      return state;
  }
}

export function updateViewportProperty(key, value) {
  return { type: UPDATE_FILE_EDITORS_PROPERTY, key, value };
}
