import api from '../api';
import ContextMenuItem from '../../../components/ContextMenuItem';

let uploadIcon = require('@opuscapita/svg-icons/lib/file_upload.svg');

export default (apiOptions, {
  showDialog,
  hideDialog,
  forceUpdate,
  updateNotifications,
  getSelection,
  getSelectedResources,
  getResource,
  getResourceChildren,
  getResourceLocation,
  getNotifications
}) => ({
  id: 'upload',
  shouldBeAvailable: (apiOptions) => true,
  availableInContexts: ['files-view', 'new-button'],
  contextMenuRenderer: (apiOptions) => (
    <ContextMenuItem
      icon={{ svg: uploadIcon }}
      onClick={() => api.uploadFileToId(getResource().id)}
    >
      <span>Upload</span>
    </ContextMenuItem>
  )
});
