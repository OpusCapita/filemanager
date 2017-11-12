import api from '../api';
import ContextMenuItem from '../../../components/ContextMenuItem';

let downloadIcon = require('@opuscapita/svg-icons/lib/file_download.svg');

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
  contextMenuRenderer: (apiOptions) => {
    let selectedResources = getSelectedResources();
    return (
      <ContextMenuItem
        icon={{ svg: downloadIcon }}
        onClick={() => api.downloadResources(selectedResources)}
      >
        <span>Download</span>
      </ContextMenuItem>
    );
  }
});
