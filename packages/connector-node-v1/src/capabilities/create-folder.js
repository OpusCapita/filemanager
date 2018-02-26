import api from '../api';
import sanitizeFilename from 'sanitize-filename';
import onFailError from '../utils/onFailError';
import icons from '../icons-svg';
import getMess from '../../translations';

let label = 'createFolder';

function handler(apiOptions, {
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

  const onFail = _ => onFailError({
    getNotifications,
    label: getMessage(label),
    notificationId: label,
    updateNotifications
  });

  let rawDialogElement = {
    elementType: 'SetNameDialog',
    elementProps: {
      onHide: hideDialog,
      onSubmit: async (folderName) => {
        let resource = getResource();
        let { resourceChildren } = await api.getChildrenForId(apiOptions, { id: resource.id, onFail });
        let alreadyExists = resourceChildren.some((o) => o.name === folderName);

        if (alreadyExists) {
          return getMessage('fileExist', { name: folderName });
        } else {
          hideDialog();
          let result = await api.createFolder(apiOptions, resource.id, folderName, { onFail });
          navigateToDir(resource.id, result.body.id, false);
        }
      },
      onValidate: async (folderName) => {
        if (!folderName) {
          return getMessage('emptyName');
        } else if (folderName === 'CON') {
          return getMessage('doNotRespectBill');
        } else if (folderName.length >= 255) {
          return getMessage('tooLongFolderName');
        } else if (folderName.trim() !== sanitizeFilename(folderName.trim())) {
          return getMessage('folderNameNotAllowedCharacters');
        }
        return null;
      },
      inputLabelText: getMessage('folderName'),
      headerText: getMessage('createFolder'),
      submitButtonText: getMessage('create')
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
    id: label,
    icon: { svg: icons.createNewFolder },
    label: localeLabel,
    shouldBeAvailable: (apiOptions) => {
      let resource = getResource();

      if (!resource || !resource.capabilities) {
        return false;
      }

      return resource.capabilities.canAddChildren;
    },
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
    })
  };
}
