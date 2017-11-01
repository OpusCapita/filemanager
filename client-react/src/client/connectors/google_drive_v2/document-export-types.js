let defaultFill = '#333';

let documentMimeTypes = [
  {
    title: 'HTML',
    mimeType: 'text/html',
    icon: { svg: '', fill: defaultFill }
  },
  {
    title: 'PDF',
    mimeType: 'application/pdf',
    icon: { svg: '', fill: defaultFill }
  },
  {
    title: 'MS Word',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    icon: { svg: '', fill: defaultFill }
  },
];

let sheetMimeTypes = [
  {
    title: 'HTML',
    mimeType: 'text/html',
    icon: { svg: '', fill: defaultFill }
  },
  {
    title: 'PDF',
    mimeType: 'application/pdf',
    icon: { svg: '', fill: defaultFill }
  },
  {
    title: 'MS Word',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    icon: { svg: '', fill: defaultFill }
  },
];

function getMimeTypes(mimeType) {
  if (mimeType === 'application/vnd.google-apps.document') {
    return documentMimeTypes;
  } else if (mimeType === 'application/vnd.google-apps.spreadsheet') {
    if (mimeType === 'application/vnd.google-apps.document') {
      return sheetMimeTypes;
    }
  }
}

export {
  getExportMimeTypes
}

/*
Documents
  HTML	text/html
  HTML (zipped)	application/zip
  Plain text	text/plain
  Rich text	application/rtf
  Open Office doc	application/vnd.oasis.opendocument.text
  PDF	application/pdf
  MS Word document	application/vnd.openxmlformats-officedocument.wordprocessingml.document
  EPUB	application/epub+zip
Spreadsheets
  MS Excel	application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  Open Office sheet	application/x-vnd.oasis.opendocument.spreadsheet
  PDF	application/pdf
  CSV (first sheet only)	text/csv
  TSV (first sheet only)	text/tab-separated-values
  HTML (zipped)	application/zip
Drawings
  JPEG	image/jpeg
  PNG	image/png
  SVG	image/svg+xml
  PDF	application/pdf
Presentations
  MS PowerPoint	application/vnd.openxmlformats-officedocument.presentationml.presentation
  Open Office presentation	application/vnd.oasis.opendocument.presentation
  PDF	application/pdf
Plain
  text
  text/plain
Apps Scripts
  JSON	application/vnd.google-apps.script+json
*/
