import api from '../api';
import sanitizeFilename from 'sanitize-filename';
import icons from '../icons-svg';
import getMess from '../translations';

const label = 'createFolder';

function handler(apiOptions, actions) {
  const getMessage = getMess.bind(null, apiOptions.locale);

  const {
    showDialog,
    hideDialog,
    navigateToDir,
    getResource
  } = actions;

  const rawDialogElement = {
    elementType: 'SetNameDialog',
    elementProps: {
      onHide: hideDialog,
      onSubmit: async (folderName) => {
        const resource = getResource();
        const resourceChildren = await api.getChildrenForId(apiOptions, { id: resource.id });

        const alreadyExists = resourceChildren.some((o) => o.title === folderName);
        if (alreadyExists) {
          return getMessage('fileExist', { name: folderName });
        } else {
          hideDialog();
          const result = await api.createFolder(apiOptions, resource.id, folderName);
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

export default (apiOptions, actions) => {
  const localeLabel = getMess(apiOptions.locale, label);
  return {
    id: label,
    icon: { svg: icons.createNewFolder },
    label: localeLabel,
    shouldBeAvailable: (apiOptions) => true,
    availableInContexts: ['files-view', 'new-button'],
    handler: () => handler(apiOptions, actions)
  };
}
