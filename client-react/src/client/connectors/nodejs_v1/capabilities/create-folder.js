import api from '../api';
import sanitizeFilename from 'sanitize-filename';
import ContextMenuItem from '../../../components/ContextMenuItem';
import SetNameDialog from '../../../components/SetNameDialog';

let createFolderIcon = require('@opuscapita/svg-icons/lib/create_new_folder.svg');

function handler(apiOptions, {
  id,
  showDialog,
  hideDialog,
  forceUpdate,
  updateNotifications,
  getSelection,
  getSelectedResources,
  getResource,
  getResourceChildren,
  getResourceLocation,
  getNotifications
}) {
  showDialog((
    <SetNameDialog
      onHide={hideDialog}
      onSubmit={async (folderName) => {
        let resource = getResource();
        let { resourceChildren } = await api.getChildrenForId(apiOptions, resource.id);
        let alreadyExists = resourceChildren.some((o) => o.title === folderName);
        if (alreadyExists) {
          return `File or folder with name "${folderName}" already exists`;
        } else {
          hideDialog();
          await api.createFolder(apiOptions, resource.id, folderName);
          forceUpdate();
        }
      }}
      onValidate={async (folderName) => {
        if (!folderName) {
          return 'Name can\'t be empty';
        } else if (folderName === 'CON') {
          return 'We too do not respect Bill ;)';
        } else if (folderName.length >= 255) {
          return 'Folder name can\'t contain more than 255 characters';
        } else if (folderName.trim() !== sanitizeFilename(folderName.trim())) {
          return 'Folder name contains not allowed characters';
        }
        return null;
      }}
      headerText={`Folder name`}
      submitButtonText={`Create`}
      />
  ));
}

export default (apiOptions, {
  showDialog,
  hideDialog,
  forceUpdate,
  updateNotifications,
  getSelection,
  getSelectedResources,
  getResource,
  getResourceChildren,
  getResourceLocation,
  getNotifications
}) => ({
  id: 'createFolder',
  shouldBeAvailable: (apiOptions) => true,
  availableInContexts: ['files-view', 'new-button'],
  handler: () => handler(apiOptions, {
    showDialog,
    hideDialog,
    forceUpdate,
    updateNotifications,
    getSelection,
    getSelectedResources,
    getResource,
    getResourceChildren,
    getResourceLocation,
    getNotifications
  }),
  contextMenuRenderer: (apiOptions) => (
    <ContextMenuItem
      icon={{ svg: createFolderIcon }}
      onClick={() => handler(apiOptions, {
        showDialog,
        hideDialog,
        forceUpdate,
        updateNotifications,
        getSelection,
        getSelectedResources,
        getResource,
        getResourceChildren,
        getResourceLocation,
        getNotifications
      })}
    >
      <span>Create folder</span>
    </ContextMenuItem>
  )
});
