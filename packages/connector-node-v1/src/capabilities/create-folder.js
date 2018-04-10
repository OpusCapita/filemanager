import api from '../api';
import sanitizeFilename from 'sanitize-filename';
import onFailError from '../utils/onFailError';
import icons from '../icons-svg';
import getMess from '../translations';

let label = 'createFolder';

function handler(apiOptions, actions) {
  const {
    showDialog,
    hideDialog,
    navigateToDir,
    getResource,
    notices
  } = actions;

  const getMessage = getMess.bind(null, apiOptions.locale);

  const rawDialogElement = {
    elementType: 'SetNameDialog',
    elementProps: {
      onHide: hideDialog,
      onSubmit: async (folderName) => {
        const resource = getResource();
        try {
          const resourceChildren = await api.getChildrenForId(apiOptions, { id: resource.id });
          const alreadyExists = resourceChildren.some(({ name }) => name === folderName);

          if (alreadyExists) {
            return getMessage('fileExist', { name: folderName });
          } else {
            hideDialog();
            const result = await api.createFolder(apiOptions, resource.id, folderName);
            navigateToDir(resource.id, result.body.id, false);
          }
          return null
        } catch (err) {
          hideDialog();
          onFailError({
            label: getMessage(label),
            notificationId: label,
            notices
          });
          console.log(err);
          return null
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
      submitButtonText: getMessage('create'),
      cancelButtonText: getMessage('cancel')
    }
  };

  showDialog(rawDialogElement);
}

export default (apiOptions, actions) => {
  const localeLabel = getMess(apiOptions.locale, label);
  const { getResource } = actions;
  return {
    id: label,
    icon: { svg: icons.createNewFolder },
    label: localeLabel,
    shouldBeAvailable: (apiOptions) => {
      const resource = getResource();

      if (!resource || !resource.capabilities) {
        return false;
      }

      return resource.capabilities.canAddChildren;
    },
    availableInContexts: ['files-view', 'new-button'],
    handler: () => handler(apiOptions, actions)
  };
}
