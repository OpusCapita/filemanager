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
  id: 'download',
  shouldBeAvailable: (apiOptions) => {
    let selectedResources = getSelectedResources();
    return selectedResources.length === 1 && selectedResources[0].type !== 'dir';
  },
  contextMenuRenderer: (apiOptions) => (
    <ContextMenuItem
      icon={{ svg: uploadIcon }}
      onClick={() => api.uploadFileToId(getResource().id)}
    >
      <span>Upload</span>
    </ContextMenuItem>
  )
});
