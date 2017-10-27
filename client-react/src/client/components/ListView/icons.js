let dirIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/folder.svg');
let unknownFileIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/insert_drive_file.svg');

export function getIcon(resource) {
  if (resource.type === 'dir') {
    return { svg: dirIcon, fill: '#333' };
  } else {
    return { svg: unknownFileIcon, fill: '#333' };
  }
};
