import ContextMenuItem from '../../components/ContextMenuItem';
import SVG from '@opuscapita/react-svg/lib/SVG';
import api from './api';
import SetNameDialog from '../../components/SetNameDialog';
import sanitizeFilename from 'sanitize-filename';

let downloadIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/file_download.svg');
let deleteIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/delete.svg');
let createFolderIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/create_new_folder.svg');

export default (apiOptions, { showDialog, hideDialog }) => ([
  {
    id: 'createFolder',
    shouldBeAvailable: (apiOptions, { selectedResources }) => selectedResources.length === 1,
    contextMenuRenderer: (apiOptions, {
      selection,
      selectedResources,
      resource,
      resourceChildren,
      resourceLocation
    }) => (
      <ContextMenuItem
        icon={{ svg: createFolderIcon }}
        onClick={() => {
          showDialog((
            <SetNameDialog
              onHide={hideDialog}
              onSubmit={async (folderName) => {
                let { resourceChildren } = await api.getChildrenForId(apiOptions, resource.id);
                let alreadyExists = resourceChildren.some((o) => o.title === folderName);
                if (alreadyExists) {
                  return `File or folder with name "${folderName}" already exists`;
                } else {
                  return api.createFolder(apiOptions, resource.id, folderName);
                }
              }}
              onValidate={async (folderName) => {
                if (!folderName) {
                  return 'You must specify a folder name';
                } else if (folderName === 'hello') {
                  return 'Choose another folder name';
                } else if (folderName.length >= 255) {
                  return 'Folder name can\'t contain more than 255 characters';
                } else if (folderName.trim() !== sanitizeFilename(folderName.trim())) {
                  return 'Folder name contains not allowed characters';
                }
                return null;
              }}
              headerText={`Folder name`}
            />
          ));
        }}
      >
        <span>Create folder</span>
      </ContextMenuItem>
    )
  },
  {
    id: 'download',
    shouldBeAvailable: (apiOptions, { selectedResources }) => {
      return selectedResources.length === 1 && selectedResources[0].type !== 'dir';
    },
    contextMenuRenderer: (apiOptions, { selectedResources }) => (
      <ContextMenuItem
        icon={{ svg: downloadIcon }}
        onClick={() => api.downloadResources(selectedResources)}
      >
        <span>Download</span>
      </ContextMenuItem>
    )
  },
  {
    id: 'delete',
    title: 'Remove',
    shouldBeAvailable: (apiOptions, { selectedResources }) => {
      return selectedResources.every(resource => resource.capabilities.canDelete);
    },
    contextMenuRenderer: (apiOptions, { selectedResources }) => (
      <ContextMenuItem icon={{ svg: deleteIcon }}>
        <span>Remove</span>
      </ContextMenuItem>
    )
  }
]);
