import api from '../api';
import ContextMenuItem from '../../../components/ContextMenuItem';

let deleteIcon = require('@opuscapita/svg-icons/lib/delete.svg');

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
    let selectedResources = getSelectedResources();
    return selectedResources.every(resource => resource.capabilities.canDelete);
  },
  contextMenuRenderer: (apiOptions) => (
    <ContextMenuItem icon={{ svg: deleteIcon }}>
      <span>Remove</span>
    </ContextMenuItem>
  )
});
