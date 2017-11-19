import api from '../api';
import sanitizeFilename from 'sanitize-filename';
import icons from '../icons-svg';

let icon = icons.createNewFolder;
let label = 'Create folder';

function handler(apiOptions, {
  id,
  showDialog,
  hideDialog,
  navigateToDir,
  updateNotifications,
  getSelection,
  getSelectedResources,
  getResource,
  getResourceChildren,
  getResourceLocation,
  getNotifications
}) {
  let rawDialogElement = {
    elementType: 'SetNameDialog',
    elementProps: {
      onHide: hideDialog,
      onSubmit: async (folderName) => {
        let resource = getResource();
        let { resourceChildren } = await api.getChildrenForId(apiOptions, { id: resource.id });
        let alreadyExists = resourceChildren.some((o) => o.title === folderName);
        if (alreadyExists) {
          return `File or folder with name "${folderName}" already exists`;
        } else {
          hideDialog();
          let result = await api.createFolder(apiOptions, resource.id, folderName);
          navigateToDir(resource.id, result.id, false);
        }
      },
      onValidate: async (folderName) => {
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
      },
      headerText: `Folder name`,
      submitButtonText: `Create`
    }
  };

  showDialog(rawDialogElement);
}

export default (apiOptions, {
  showDialog,
  hideDialog,
  navigateToDir,
  updateNotifications,
  getSelection,
  getSelectedResources,
  getResource,
  getResourceChildren,
  getResourceLocation,
  getNotifications
}) => ({
  id: 'createFolder',
  icon: { svg: icon },
  label,
  shouldBeAvailable: (apiOptions) => true,
  availableInContexts: ['files-view', 'new-button'],
  handler: () => handler(apiOptions, {
    showDialog,
    hideDialog,
    navigateToDir,
    updateNotifications,
    getSelection,
    getSelectedResources,
    getResource,
    getResourceChildren,
    getResourceLocation,
    getNotifications
  }),
  contextMenuRenderer: (apiOptions) => (
    {
      elementType: 'ContextMenuItem',
      elementProps: {
        icon: { svg: icon },
        onClick: () => handler(apiOptions, {
          showDialog,
          hideDialog,
          navigateToDir,
          updateNotifications,
          getSelection,
          getSelectedResources,
          getResource,
          getResourceChildren,
          getResourceLocation,
          getNotifications
        }),
        children: label
      }
    })
});
