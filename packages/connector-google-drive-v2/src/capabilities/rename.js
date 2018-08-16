import api from '../api';
import sanitizeFilename from 'sanitize-filename';
import icons from '../icons-svg';
import getMess from '../translations';

const label = 'rename';

function handler(apiOptions, actions) {
  const getMessage = getMess.bind(null, apiOptions.locale);

  const {
    showDialog,
    hideDialog,
    navigateToDir,
    getSelectedResources,
    getResource,
  } = actions;

  const rawDialogElement = {
    elementType: 'SetNameDialog',
    elementProps: {
      initialValue: getSelectedResources()[0].title,
      onHide: hideDialog,
      onSubmit: async (name) => {
        const selectedResources = getSelectedResources();
        const resourceChildren = await api.getChildrenForId(apiOptions, { id: selectedResources[0].parents[0].id });
        const alreadyExists = resourceChildren.some((o) => o.title === name);
        if (alreadyExists) {
          return getMessage('fileExist', { name });
        } else {
          hideDialog();
          const result = await api.renameResource(apiOptions, selectedResources[0].id, name);
          const resource = getResource();
          navigateToDir(resource.id, result.body.id, false);
        }
        return null;
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

export default (apiOptions, actions) => {
  const localeLabel = getMess(apiOptions.locale, label);
  const { getSelectedResources } = actions;
  return {
    id: label,
    icon: { svg: icons.rename },
    label: localeLabel,
    shouldBeAvailable: (apiOptions) => {
      const selectedResources = getSelectedResources();
      return (
        selectedResources.length === 1 &&
        selectedResources[0].id !== 'root' // root is not mutable
      );
    },
    availableInContexts: ['row', 'toolbar'],
    handler: () => handler(apiOptions, actions)
  };
}
