import api from '../api';
import sanitizeFilename from 'sanitize-filename';
import ContextMenuItem from '../../../components/ContextMenuItem';
import SetNameDialog from '../../../components/SetNameDialog';

let renameIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/title.svg');

export default (apiOptions, {
  showDialog,
  hideDialog,
  forceUpdate,
  getSelection,
  getSelectedResources,
  getResource,
  getResourceChildren,
  getResourceLocation,
  getNotifications
}) => ({
  id: 'rename',
  shouldBeAvailable: (apiOptions) => {
    let selectedResources = getSelectedResources();
    return (
      selectedResources.length === 1 &&
      selectedResources[0].id !== 'root' // root is not mutable
    );
  },
  contextMenuRenderer: (apiOptions) => (
    <ContextMenuItem
      icon={{ svg: renameIcon }}
      onClick={() => {
        showDialog((
          <SetNameDialog
            onHide={hideDialog}
            onSubmit={async (name) => {
              let selectedResources = getSelectedResources();
              let { resourceChildren } = await api.getChildrenForId(apiOptions, selectedResources[0].parents[0].id);
              let alreadyExists = resourceChildren.some((o) => o.title === name);
              if (alreadyExists) {
                return `File or folder with name "${name}" already exists`;
              } else {
                hideDialog();
                await api.renameResource(apiOptions, selectedResources[0].id, name);
                forceUpdate();
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
          />
        ));
      }}
    >
      <span>Rename</span>
    </ContextMenuItem>
  )
});
