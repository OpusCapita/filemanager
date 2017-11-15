import api from '../api';
import ContextMenuItem from '../../../components/ContextMenuItem';
import ConfirmDialog from '../../../components/ConfirmDialog';

let icon = require('@opuscapita/svg-icons/lib/delete.svg');
let label = 'Remove';

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
  let onSuccess = () => {
    let resource = getResource();
    navigateToDir(resource.id, null, false);
  };

  let onFail = () => {};

  let selectedResources = getSelectedResources();

  let dialogNameText = `Do you really want to remove\n`;
  let dialogFilesText = selectedResources.length > 1 ?
    `${selectedResources.length} files ?` :
    `"${selectedResources[0].name}" ?`;

  showDialog((
    <ConfirmDialog
      onHide={hideDialog}
      onSubmit={async () => {
        hideDialog();
        api.removeResources(apiOptions, selectedResources, { onSuccess, onFail });
      }}
      headerText={dialogNameText + dialogFilesText}
      cancelButtonText={'Cancel'}
      submitButtonText={'Confirm'}
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
  id: 'delete',
  icon: { svg: icon },
  label,
  shouldBeAvailable: (apiOptions) => {
    let selectedResources = getSelectedResources();
    return selectedResources.every(resource => resource.capabilities.canDelete);
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
