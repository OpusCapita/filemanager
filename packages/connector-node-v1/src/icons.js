import icons from './icons-svg';

const dirIcon = icons.folder;
const brokenLinkIcon = icons.brokenLink;
const encodingNameError = icons.encodingNameError;
const soundFileIcon = icons.volumeUp;
const pictureFileIcon = icons.image;
const videoFileIcon = icons.ondemandVideo;
const archiveFileIcon = icons.archive;
const booksFileIcon = icons.book;
const unknownFileIcon = icons.insertDriveFile;

const defaultFillColor = '#424242';
const soundFilesExtensions = ['aac', 'aiff', 'flac', 'm4a', 'ogg', 'mp3', 'wav', 'wma'];
const pictureFilesExtensions = ['gif', 'png', 'jpg', 'jpeg', 'bmp', 'svg'];
const videoFilesExtensions = ['avi', 'flv', 'wmv', 'mov', 'mp4'];
const archiveFilesExtensions = ['tar', 'zip', 'gz', 'bz2', 'rar'];
const booksFilesExtensions = ['pdf', 'epub', 'fb2'];

function matchFileExtensions(filename, extensions) {
  const extensionsRegExp = `(${extensions.join('|')})`;
  return extensions.some((o) => new RegExp(`^.*\.${extensionsRegExp}$`).test(filename.toLowerCase()));
}

export function getIcon(resource) {
  if (resource.type === 'dir') {
    return { svg: dirIcon, fill: defaultFillColor };
  } else if (resource.type === 'brokenlink') {
    return { svg: brokenLinkIcon, fill: defaultFillColor };
  } else if (resource.type === 'encodingnameerror') {
    return { svg: encodingNameError, fill: defaultFillColor };
  } else if (matchFileExtensions(resource.name, soundFilesExtensions)) {
    return { svg: soundFileIcon, fill: `#e53935` };
  } else if (matchFileExtensions(resource.name, pictureFilesExtensions)) {
    return { svg: pictureFileIcon, fill: `#e53935` };
  } else if (matchFileExtensions(resource.name, videoFilesExtensions)) {
    return { svg: videoFileIcon, fill: `#e53935` };
  } else if (matchFileExtensions(resource.name, archiveFilesExtensions)) {
    return { svg: archiveFileIcon, fill: `#616161` };
  } else if (matchFileExtensions(resource.name, booksFilesExtensions)) {
    return { svg: booksFileIcon, fill: `#e53935` };
  } else {
    return { svg: unknownFileIcon, fill: `#616161` };
  }
}
