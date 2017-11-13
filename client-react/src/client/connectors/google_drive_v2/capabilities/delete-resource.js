import api from '../api';
import ContextMenuItem from '../../../components/ContextMenuItem';

let deleteIcon = require('@opuscapita/svg-icons/lib/delete.svg');

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
  id: 'delete',
  title: 'Remove',
  shouldBeAvailable: (apiOptions) => {
    // let selectedResources = getSelectedResources();
    // return selectedResources.every(resource => resource.capabilities.canDelete);
    return false;
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
  contextMenuRenderer: (apiOptions) => (
    <ContextMenuItem icon={{ svg: deleteIcon }}>
      <span>Remove</span>
    </ContextMenuItem>
  )
});
