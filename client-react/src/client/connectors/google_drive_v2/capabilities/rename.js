import api from '../api';
import sanitizeFilename from 'sanitize-filename';
import ContextMenuItem from '../../../components/ContextMenuItem';
import SetNameDialog from '../../../components/SetNameDialog';

let renameIcon = require('!!raw-loader!@opuscapita/svg-icons/lib/title.svg');

export default (apiOptions, { showDialog, hideDialog, forceUpdate }) => ({
  id: 'rename',
  shouldBeAvailable: (apiOptions, { selectedResources }) => selectedResources.length === 1,
  contextMenuRenderer: (apiOptions, {
    selection,
    selectedResources,
    resource,
    resourceChildren,
    resourceLocation
  }) => (
    <ContextMenuItem
      icon={{ svg: renameIcon }}
      onClick={() => {
        showDialog((
          <SetNameDialog
            onHide={hideDialog}
            onSubmit={async (folderName) => {
              let { resourceChildren } = await api.getChildrenForId(apiOptions, resource.id);
              let alreadyExists = resourceChildren.some((o) => o.title === folderName);
              if (alreadyExists) {
                return `File or folder with name "${folderName}" already exists`;
              } else {
                hideDialog();
                await api.createFolder(apiOptions, resource.id, folderName);
                forceUpdate();
              }
            }}
            onValidate={async (folderName) => {
              if (!folderName) {
                return 'You must specify a folder name';
              } else if (folderName === 'CON') {
                return 'Don\'t you alone do not respect Bill ;)';
              } else if (folderName.length >= 255) {
                return 'Folder name can\'t contain more than 255 characters';
              } else if (folderName.trim() !== sanitizeFilename(folderName.trim())) {
                return 'Folder name contains not allowed characters';
              }
              return null;
            }}
            headerText={`Folder name`}
          />
        ));
      }}
    >
      <span>Rename</span>
    </ContextMenuItem>
  )
});
