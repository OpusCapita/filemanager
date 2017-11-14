import api from '../api';
import sanitizeFilename from 'sanitize-filename';
import ContextMenuItem from '../../../components/ContextMenuItem';
import SetNameDialog from '../../../components/SetNameDialog';

let icon = `<svg class="a-s-fa-Ha-pa" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" focusable="false" fill="rgba(0, 0, 0, 0.72)"><path d="M0 0h24v24H0z" fill="none"></path><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM6 17v-2.47l7.88-7.88c.2-.2.51-.2.71 0l1.77 1.77c.2.2.2.51 0 .71L8.47 17H6zm12 0h-7.5l2-2H18v2z"></path></svg>`;
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
