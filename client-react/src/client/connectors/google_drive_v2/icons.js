let dirIcon = require('@opuscapita/svg-icons/lib/folder.svg');
let soundFileIcon = require('@opuscapita/svg-icons/lib/volume_up.svg');
let pictureFileIcon = require('@opuscapita/svg-icons/lib/image.svg');
let videoFileIcon = require('@opuscapita/svg-icons/lib/ondemand_video.svg');
let archiveFileIcon = require('@opuscapita/svg-icons/lib/archive.svg');
let booksFileIcon = require('@opuscapita/svg-icons/lib/book.svg');
let unknownFileIcon = require('@opuscapita/svg-icons/lib/insert_drive_file.svg');

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
};
