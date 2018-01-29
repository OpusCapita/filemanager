import api from '../api';
import onFailError from '../utils/onFailError';
import icons from '../icons-svg';
import getMess from '../../translations';

let icon = icons.delete;
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
  let getMessage = getMess.bind(null, apiOptions.locale);

  let onSuccess = () => {
    let resource = getResource();
    navigateToDir(resource.id, null, false);
  };

  const onFail = _ => onFailError({
    getNotifications,
    label: getMessage(label),
    notificationId: 'delete',
    updateNotifications
  });

  let selectedResources = getSelectedResources();

  let dialogNameText = getMessage('reallyRemove');
  let dialogFilesText = selectedResources.length > 1 ?
    `${selectedResources.length} ${getMessage('files')} ?` :
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
  let localeLabel = getMess(apiOptions.locale, label);
  return {
    id: 'delete',
    icon: { svg: icon },
    label: localeLabel,
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
        children: localeLabel
      }
    })
  };
}
