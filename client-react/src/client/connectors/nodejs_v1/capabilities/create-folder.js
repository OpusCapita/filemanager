import React from 'react';
import api from '../api';
import sanitizeFilename from 'sanitize-filename';
import ContextMenuItem from '../../../components/ContextMenuItem';
import SetNameDialog from '../../../components/SetNameDialog';
import onFailError from '../../utils/onFailError';

let icon = require('@opuscapita/svg-icons/lib/create_new_folder.svg');
let label = 'Create folder';

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
  const onFail = ({ message } = {}) => onFailError({
    getNotifications,
    label,
    notificationId: 'createFolder',
    updateNotifications,
    message
  });

  showDialog((
    <SetNameDialog
      onHide={hideDialog}
      onSubmit={async (folderName) => {
        let resource = getResource();
        let { resourceChildren } = await api.getChildrenForId(apiOptions, { id: resource.id, onFail });
        let alreadyExists = resourceChildren.some((o) => o.title === folderName);
        if (alreadyExists) {
          return `File or folder with name "${folderName}" already exists`;
        } else {
          hideDialog();
          let result = await api.createFolder(apiOptions, resource.id, folderName, { onFail });
          navigateToDir(resource.id, result.body.id, false);
        }
      }}
      onValidate={async (folderName) => {
        if (!folderName) {
          return 'Name can\'t be empty';
        } else if (folderName === 'CON') {
          return 'We too do not respect Bill ;)';
        } else if (folderName.length >= 255) {
          return 'Folder name can\'t contain more than 255 characters';
        } else if (folderName.trim() !== sanitizeFilename(folderName.trim())) {
          return 'Folder name contains not allowed characters';
        }
        return null;
      }}
      headerText={`Folder name`}
      submitButtonText={`Create`}
    />
  ));
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
  id: 'createFolder',
  icon: { svg: icon },
  label,
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
  }),
  contextMenuRenderer: (apiOptions) => (
    <ContextMenuItem
      icon={{ svg: icon }}
      onClick={() => handler(apiOptions, {
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
      })}
    >
      <span>{label}</span>
    </ContextMenuItem>
  )
});
