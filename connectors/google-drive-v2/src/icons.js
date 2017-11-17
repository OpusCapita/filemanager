import icons from './icons-svg';

let dirIcon = icons.folder;
let soundFileIcon = icons.volumeUp;
let pictureFileIcon = icons.image;
let videoFileIcon = icons.ondemandVideo;
let archiveFileIcon = icons.archive;
let booksFileIcon = icons.book;
let unknownFileIcon = icons.insertDriveFile;

let defaultFillColor = '#424242';
let soundFilesExtensions = ['aac', 'aiff', 'flac', 'm4a', 'ogg', 'mp3', 'wav', 'wma'];
let pictureFilesExtensions = ['gif', 'png', 'jpg', 'jpeg', 'bmp', 'svg'];
let videoFilesExtensions = ['avi', 'flv', 'wmv', 'mov', 'mp4'];
let archiveFilesExtensions = ['tar', 'zip', 'gz', 'bz2', 'rar'];
let booksFilesExtensions = ['pdf', 'epub', 'fb2'];

function matchFileExtensions(filename, extensions) {
  let extensionsRegExp = `(${extensions.join('|')})`;
  return extensions.some((o) => new RegExp(`^.*\.${extensionsRegExp}$`).test(filename.toLowerCase()));
};

export function getIcon(resource) {
  if (resource.type === 'dir') {
    return { svg: dirIcon, fill: defaultFillColor };
  } else if (matchFileExtensions(resource.title, soundFilesExtensions)) {
    return { svg: soundFileIcon, fill: `#e53935` };
  } else if (matchFileExtensions(resource.title, pictureFilesExtensions)) {
    return { svg: pictureFileIcon, fill: `#e53935` };
  } else if (matchFileExtensions(resource.title, videoFilesExtensions)) {
    return { svg: videoFileIcon, fill: `#e53935` };
  } else if (matchFileExtensions(resource.title, archiveFilesExtensions)) {
    return { svg: archiveFileIcon, fill: `#616161` };
  } else if (matchFileExtensions(resource.title, booksFilesExtensions)) {
    return { svg: booksFileIcon, fill: `#e53935` };
  } else {
    return { svg: unknownFileIcon, fill: `#616161` };
  }
}
