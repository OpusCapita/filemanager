import api from '../api';
import sanitizeFilename from 'sanitize-filename';
import icons from '../icons-svg';
import getMess from '../../translations';

let label = 'createFolder';

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

  let rawDialogElement = {
    elementType: 'SetNameDialog',
    elementProps: {
      onHide: hideDialog,
      onSubmit: async (folderName) => {
        let resource = getResource();
        let resourceChildren = await api.getChildrenForId(apiOptions, { id: resource.id });

        let alreadyExists = resourceChildren.some((o) => o.title === folderName);
        if (alreadyExists) {
          return getMessage('fileExist', { name: folderName });
        } else {
          hideDialog();
          let result = await api.createFolder(apiOptions, resource.id, folderName);
          navigateToDir(resource.id, result.id, false);
        }
        return null;
      },
      onValidate: async (folderName) => {
        if (!folderName) {
          return getMessage('emptyName');
        } else if (folderName === 'CON') {
          return getMessage('doNotRespectBill');
        } else if (folderName.length >= 255) {
          return getMessage('tooLongName');
        } else if (folderName.trim() !== sanitizeFilename(folderName.trim())) {
          return getMessage('notAllowedCharacters');
        }
        return null;
      },
      headerText: getMessage('folderName'),
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
    })
  };
}
