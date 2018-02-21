import api from '../api';
import sanitizeFilename from 'sanitize-filename';
import onFailError from '../utils/onFailError';
import icons from '../icons-svg';
import getMess from '../../translations';

let icon = icons.rename;
let label = 'rename';

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
  let localeLabel = getMessage(label);

  const onFail = ({ message }) => onFailError({
    getNotifications,
    label: localeLabel,
    notificationId: label,
    updateNotifications,
    message
  });

  let rawDialogElement = {
    elementType: 'SetNameDialog',
    elementProps: {
      initialValue: getSelectedResources()[0].name,
      onHide: hideDialog,
      onSubmit: async (name) => {
        let selectedResources = getSelectedResources();
        let { resourceChildren } = await api.getChildrenForId(
          apiOptions, { id: selectedResources[0].parentId, onFail }
        );
        let alreadyExists = resourceChildren.some((o) => o.name === name);
        if (alreadyExists) {
          return getMessage('fileExist', { name });
        } else {
          hideDialog();
          let result = await api.renameResource(apiOptions, selectedResources[0].id, name, { onFail });
          let resource = getResource();
          navigateToDir(resource.id, result.body.id, false);
        }
      },
      onValidate: async (name) => {
        if (!name) {
          return getMessage('emptyName');
        } else if (name.length >= 255) {
          return getMessage('tooLongFolderName');
        } else if (name.trim() !== sanitizeFilename(name.trim())) {
          return getMessage('folderNameNotAllowedCharacters');
        }
        return null;
      },
      headerText: getMessage('newName'),
      submitButtonText: localeLabel
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
    icon: { svg: icon },
    label: localeLabel,
    shouldBeAvailable: (apiOptions) => {
      let selectedResources = getSelectedResources();

      return (
        selectedResources.length === 1 &&
        selectedResources.every(r => r.capabilities.canRename)
      );
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
