import api from '../api';
import onFailError from '../utils/onFailError';
import icons from '../icons-svg';
import getMess from '../translations';

let label = 'remove';

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
  const getMessage = getMess.bind(null, apiOptions.locale);

  const selectedResources = getSelectedResources();

  const dialogFilesText = selectedResources.length > 1 ?
    `${selectedResources.length} ${getMessage('files')}` :
    `"${selectedResources[0].name}"`;

  const dialogNameText = getMessage('reallyRemove', { files: dialogFilesText });

  const rawDialogElement = {
    elementType: 'ConfirmDialog',
    elementProps: {
      onHide: hideDialog,
      onSubmit: async () => {
        hideDialog();
        try {
          await api.removeResources(apiOptions, selectedResources);
          const resource = getResource();
          navigateToDir(resource.id, null, false);
        } catch (err) {
          onFailError({
            getNotifications,
            label: getMessage(label),
            notificationId: 'delete',
            updateNotifications
          });
          console.log(err)
        }
      },
      headerText: getMessage('remove'),
      messageText: dialogNameText,
      cancelButtonText: getMessage('cancel'),
      submitButtonText: getMessage('confirm')
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
}) => {
  const localeLabel = getMess(apiOptions.locale, label);
  return {
    id: 'delete',
    icon: { svg: icons.delete },
    label: localeLabel,
    shouldBeAvailable: (apiOptions) => {
      const selectedResources = getSelectedResources();

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
    })
  };
}
