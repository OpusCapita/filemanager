import api from '../api';
import sanitizeFilename from 'sanitize-filename';
import onFailError from '../utils/onFailError';
import icons from '../icons-svg';
import getMess from '../../translations';

let icon = icons.rename;
let label = 'rename';
// let label = 'Rename';

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
    // label,
    notificationId: label,
    // notificationId: 'rename',
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
          return `${getMessage('fileExist1')} "${name}" ${getMessage('fileExist2')}`;
          // return `File or folder with name "${name}" already exists`;
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
          // return 'Name can\'t be empty';
        } else if (name.length >= 255) {
          return getMessage('tooLongFolderName');
          // return 'Folder name can\'t contain more than 255 characters';
        } else if (name.trim() !== sanitizeFilename(name.trim())) {
          return getMessage('folderNameNotAllowedCharacters');
          // return 'Folder name contains not allowed characters';
        }
        return null;
      },
      headerText: getMessage('newName'),
      submitButtonText: localeLabel
      // headerText: `New name`,
      // submitButtonText: `Rename`
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
    // id: 'rename',
    icon: { svg: icon },
    label: localeLabel,
    // label,
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
        // children: label
      }
    })
  };
}
