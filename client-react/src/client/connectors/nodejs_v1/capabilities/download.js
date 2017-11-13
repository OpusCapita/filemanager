import api from '../api';
import ContextMenuItem from '../../../components/ContextMenuItem';

let icon = require('@opuscapita/svg-icons/lib/file_download.svg');
let label = 'Download';

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
  api.downloadResources(apiOptions, selectedResources);
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
  icon: { svg: icon },
  label,
  shouldBeAvailable: (apiOptions) => {
    let selectedResources = getSelectedResources();
    return selectedResources.length === 1 && selectedResources[0].type !== 'dir';
  },
  availableInContexts: ['row', 'toolbar'],
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
  contextMenuRenderer: (apiOptions) => {
    return (
      <ContextMenuItem
        icon={{ svg: icon }}
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
        <span>{label}</span>
      </ContextMenuItem>
    );
  }
});
