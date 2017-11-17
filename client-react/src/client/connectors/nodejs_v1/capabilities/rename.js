import api from '../api';
import sanitizeFilename from 'sanitize-filename';
import onFailError from '../../utils/onFailError';
import icons from '../icons-svg';

let icon = icons.rename;
let label = 'Rename';

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
  const onFail = ({ message }) => onFailError({
    getNotifications,
    label,
    notificationId: 'rename',
    updateNotifications,
    message
  });

  let rawDialogElement = {
    elementType: 'SetNameDialog',
    elementProps: {
      onHide: hideDialog,
      onSubmit: async (name) => {
        let selectedResources = getSelectedResources();
        let { resourceChildren } = await api.getChildrenForId(
          apiOptions, { id: selectedResources[0].parentId, onFail }
        );
        let alreadyExists = resourceChildren.some((o) => o.name === name);
        if (alreadyExists) {
          return `File or folder with name "${name}" already exists`;
        } else {
          hideDialog();
          let result = await api.renameResource(apiOptions, selectedResources[0].id, name, { onFail });
          let resource = getResource();
          navigateToDir(resource.id, result.body.id, false);
        }
      },
      onValidate: async (name) => {
        if (!name) {
          return 'Name can\'t be empty';
        } else if (name.length >= 255) {
          return 'Name can\'t contain more than 255 characters';
        } else if (name.trim() !== sanitizeFilename(name.trim())) {
          return 'Name contains not allowed characters';
        }
        return null;
      },
      headerText: `New name`,
      submitButtonText: `Rename`
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
}) => ({
  id: 'rename',
  icon: { svg: icon },
  label,
  shouldBeAvailable: (apiOptions) => {
    let selectedResources = getSelectedResources();
    return selectedResources.length === 1;
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
      children: label
    }
  })
});
