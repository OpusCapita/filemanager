import api from '../api';
import sanitizeFilename from 'sanitize-filename';
import ContextMenuItem from '../../../components/ContextMenuItem';
import SetNameDialog from '../../../components/SetNameDialog';

let icon = require('@opuscapita/svg-icons/lib/title.svg');
let label = 'Rename';

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
  showDialog((
    <SetNameDialog
      onHide={hideDialog}
      onSubmit={async (name) => {
        let selectedResources = getSelectedResources();
        let { resourceChildren } = await api.getChildrenForId(apiOptions, selectedResources[0].parentId);
        let alreadyExists = resourceChildren.some((o) => o.title === name);
        if (alreadyExists) {
          return `File or folder with name "${name}" already exists`;
        } else {
          hideDialog();
          let result = await api.renameResource(apiOptions, selectedResources[0].id, name);
          let resource = getResource();
          navigateToDir(resource.id, result.body.id, false);
        }
      }}
      onValidate={async (name) => {
        if (!name) {
          return 'Name can\'t be empty';
        } else if (name.length >= 255) {
          return 'Name can\'t contain more than 255 characters';
        } else if (name.trim() !== sanitizeFilename(name.trim())) {
          return 'Name contains not allowed characters';
        }
        return null;
      }}
      headerText={`New name`}
      submitButtonText={`Rename`}
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
