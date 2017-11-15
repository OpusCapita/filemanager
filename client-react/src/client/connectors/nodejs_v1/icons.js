let dirIcon = require('@opuscapita/svg-icons/lib/folder.svg');
let soundFileIcon = require('@opuscapita/svg-icons/lib/audiotrack.svg');
let pictureFileIcon = require('@opuscapita/svg-icons/lib/image.svg');
let videoFileIcon = require('@opuscapita/svg-icons/lib/ondemand_video.svg');
let archiveFileIcon = require('@opuscapita/svg-icons/lib/archive.svg');
let unknownFileIcon = require('@opuscapita/svg-icons/lib/insert_drive_file.svg');
let warningIcon = require('@opuscapita/svg-icons/lib/warning.svg');

let defaultFillColor = '#333';
let soundFilesExtensions = ['aac', 'aiff', 'flac', 'm4a', 'ogg', 'mp3', 'wav', 'wma'];
let pictureFilesExtensions = ['gif', 'png', 'jpg', 'jpeg', 'bmp', 'svg'];
let videoFilesExtensions = ['avi', 'flv', 'wmv', 'mov', 'mp4'];
let archiveFilesExtensions = ['tar.gz', 'zip', 'gz'];

function matchFileExtensions(filename, extensions) {
  let extensionsRegExp = `(${extensions.join('|')})`;
  return extensions.some((o) => new RegExp(`^.*\.${extensionsRegExp}$`).test(filename));
};

export function getIcon(resource) {
  if (resource.type === 'dir') {
    return { svg: dirIcon, fill: defaultFillColor };
  } else if (matchFileExtensions(resource.title, soundFilesExtensions)) {
    return { svg: soundFileIcon, fill: defaultFillColor };
  } else if (matchFileExtensions(resource.title, pictureFilesExtensions)) {
    return { svg: pictureFileIcon, fill: defaultFillColor };
  } else if (matchFileExtensions(resource.title, videoFilesExtensions)) {
    return { svg: videoFileIcon, fill: defaultFillColor };
  } else if (matchFileExtensions(resource.title, archiveFilesExtensions)) {
    return { svg: archiveFileIcon, fill: defaultFillColor };
  } else if (resource.title === 'error') {
    return { svg: warningIcon, fill: defaultFillColor }
  } else {
    return { svg: unknownFileIcon, fill: defaultFillColor };
  }
};
