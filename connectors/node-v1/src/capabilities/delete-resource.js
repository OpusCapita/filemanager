import api from '../api';
import onFailError from '../utils/onFailError';
import icons from '../icons-svg';

let icon = icons.delete;
let label = 'Remove';

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
  let onSuccess = () => {
    let resource = getResource();
    navigateToDir(resource.id, null, false);
  };

  const onFail = _ => onFailError({
    getNotifications,
    label,
    notificationId: 'delete',
    updateNotifications
  });

  let selectedResources = getSelectedResources();

  let dialogNameText = `Do you really want to remove\n`;
  let dialogFilesText = selectedResources.length > 1 ?
    `${selectedResources.length} files ?` :
    `"${selectedResources[0].name}" ?`;

  let rawDialogElement = {
    elementType: 'ConfirmDialog',
    elementProps: {
      onHide: hideDialog,
      onSubmit: async () => {
        hideDialog();
        api.removeResources(apiOptions, selectedResources, { onSuccess, onFail });
      },
      headerText: dialogNameText + dialogFilesText,
      cancelButtonText: 'Cancel',
      submitButtonText: 'Confirm'
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
  id: 'delete',
  icon: { svg: icon },
  label,
  shouldBeAvailable: (apiOptions) => {
    let selectedResources = getSelectedResources();

    if (!selectedResources.length) {
      return false;
    }

    return selectedResources.every(resource => resource.capabilities.canDelete);
  },
  availableInContexts: ['row', 'toolbar'],
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
  contextMenuRenderer: (apiOptions) => ({
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
