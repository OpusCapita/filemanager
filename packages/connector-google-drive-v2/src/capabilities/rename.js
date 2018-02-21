import api from '../api';
import sanitizeFilename from 'sanitize-filename';
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

  let rawDialogElement = {
    elementType: 'SetNameDialog',
    elementProps: {
      initialValue: getSelectedResources()[0].title,
      onHide: hideDialog,
      onSubmit: async (name) => {
        let selectedResources = getSelectedResources();
        let { resourceChildren } = await api.getChildrenForId(apiOptions, { id: selectedResources[0].parents[0].id });
        let alreadyExists = resourceChildren.some((o) => o.title === name);
        if (alreadyExists) {
          return getMessage('fileExist', { name });
        } else {
          hideDialog();
          let result = await api.renameResource(apiOptions, selectedResources[0].id, name);
          let resource = getResource();
          navigateToDir(resource.id, result.body.id, false);
        }
      },
      onValidate: async (name) => {
        if (!name) {
          return getMessage('emptyName');
        } else if (name.length >= 255) {
          return getMessage('tooLongName');
        } else if (name.trim() !== sanitizeFilename(name.trim())) {
          return getMessage('notAllowedCharacters');
        }
        return null;
      },
      headerText: getMessage('newName'),
      submitButtonText: getMessage(label)
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
    id: label,
    icon: { svg: icon },
    label: localeLabel,
    shouldBeAvailable: (apiOptions) => {
      let selectedResources = getSelectedResources();
      return (
        selectedResources.length === 1 &&
        selectedResources[0].id !== 'root' // root is not mutable
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
