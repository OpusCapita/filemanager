module.exports = {
  "layout": {
    // "dateTimeFormat": "yyyy-MM-dd HH:mm:ss",
    // "locale": "en",
    "readOnly": false,
    // "showAddressBar": true,
    // "showContextMenu": true,
    // "showDirectoriesSize": true,
    // "showExtensionIcons": true,
    // "showFileActions": true,
    // "showTreeView": false,
    // "splitView": false,
    // "humanReadableFileSize": true
  },
  // "editablePatterns": {
  //   "plainMarkdown": {
  //     "pattern": ["\\.(md)", "i"],
  //     "component": "@opuscapita/react-markdown@latest/MarkdownInput",
  //     "componentProperties": {}
  //   },
  //   "plainText": {
  //     "pattern": ["\\.(txt)", "i"],
  //     "component": "@opuscapita/react-text-editors@2.1.5/PlainTextEditor",
  //     "componentProperties": {}
  //   },
  //   "codeHtml": {
  //     "pattern": ["\\.(htm|html)", "i"],
  //     "component": "@opuscapita/react-code-editor@2.1.5/CodeEditor",
  //     "componentProperties": { "syntax": "html" }
  //   },
  //   "codeGsp": {
  //     "pattern": ["\\.(gsp)", "i"],
  //     "component": "@opuscapita/react-code-editor@1.2.5/CodeEditor",
  //     "componentProperties": { "syntax": "gsp" }
  //   }
  // },
  "fileIcons": {
    "wordDocument": {
      "pattern": ["\\.(doc|docx)", "i"],
      "uri": "/img/file-icons/word-file.svg"
    },
    "excelDocument": {
      "pattern": ["\\.(xls|xlsx)", "i"],
      "uri": "/img/file-icons/excel-file.svg"
    },
    "pdfDocument": {
      "pattern": ["\\.(pdf)", "i"],
      "uri": "/img/file-icons/pdf-file.svg"
    },
    "textDocument": {
      "pattern": ["\\.(txt)", "i"],
      "uri": "/img/file-icons/text-file.svg"
    },
    "jsCode": {
      "pattern": ["\\.(js|jsx|mjs)", "i"],
      "uri": "/img/file-icons/js-file.svg"
    },
    "gspCode": {
      "pattern": ["\\.(gsp)", "i"],
      "uri": "/img/file-icons/gsp-file.svg"
    },
    "sound": {
      "pattern": ["\\.(wav|wma|mp3|ogg|flac|aiff)", "i"],
      "uri": "/img/file-icons/sound-file.svg"
    },
    "video": {
      "pattern": ["\\.(webm|mkv|flv|vob|avi|wmv|mpg|mpeg|mpv|m4v)", "i"],
      "uri": "/img/file-icons/video-file.svg"
    },
    "compressed": {
      "pattern": ["\\.(gz|tar|rar|g?zip)$", "i"],
      "uri": "/img/file-icons/compressed.svg"
    },
    "directory": {
      "uri": "/img/file-icons/directory.svg"
    },
    "unknown": {
      "pattern": ["\\.*", "i"],
      "uri": "/img/file-icons/unknown-file.svg"
    }
  }
  // "compression": {
  //   "compressedFilesPattern": ["\\.(gz|tar|rar|g?zip)$", "i"]
  // },
  // "download": {
  //   "multipleDownloadFileName": "oc-files"
  // },
  // "upload": {
  //   "maxUploadSize": 300000
  // }
};
