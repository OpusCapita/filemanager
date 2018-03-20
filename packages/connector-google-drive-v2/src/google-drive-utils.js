function getExportMimeType(mimeType) {
  switch (mimeType) {
    case 'application/vnd.google-apps.document':
      return ({
        exportMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        extension: 'docx'
      });
    case 'application/vnd.google-apps.spreadsheet':
      return ({
        exportMimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        extension: 'xlsx'
      });
    case 'application/vnd.google-apps.presentation':
      return ({
        exportMimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        extension: 'pptx'
      });
    default:
      return ({
        exportMimeType: 'text/plain',
        extension: ''
      });
  }
}

function checkIsGoogleDocument(mimeType) {
  return (
    mimeType === 'application/vnd.google-apps.document' ||
    mimeType === 'application/vnd.google-apps.spreadsheet' ||
    mimeType === 'application/vnd.google-apps.presentation'
  );
}

function getDownloadParams(resource) {
  const { mimeType, title } = resource;
  let { downloadUrl } = resource;

  if (downloadUrl) {
    return {
      downloadUrl,
      direct: true,
      mimeType,
      fileName: title
    };
  }

  let fileName = '';
  const isGoogleDocument = checkIsGoogleDocument(mimeType);

  if (isGoogleDocument) {
    const {
      exportMimeType,
      extension
    } = getExportMimeType(mimeType);
    downloadUrl = resource.exportLinks[exportMimeType];
    fileName = `${title}.${extension}`;
  } else {
    downloadUrl = `https://www.googleapis.com/drive/v2/files/${resource.id}?alt=media`;
    fileName = title;
  }

  return {
    downloadUrl,
    direct: false,
    mimeType,
    fileName
  };
}

function showUploadDialog() {

}

export {
  getExportMimeType,
  checkIsGoogleDocument,
  showUploadDialog,
  getDownloadParams
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
