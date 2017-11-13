import api from '../api';
import ContextMenuItem from '../../../components/ContextMenuItem';

let downloadIcon = require('@opuscapita/svg-icons/lib/file_download.svg');

function handler(apiOptions, {
  id,
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
}) {
  let selectedResources = getSelectedResources();
  api.downloadResources(selectedResources);
}

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
  handler: () => handler(apiOptions, {
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
  }),
  availableInContexts: ['row', 'toolbar'],
  contextMenuRenderer: (apiOptions) => {
    return (
      <ContextMenuItem
        icon={{ svg: downloadIcon }}
        onClick={() => handler(apiOptions, {
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
        })}
      >
        <span>Download</span>
      </ContextMenuItem>
    );
  }
});
