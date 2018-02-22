import api from '../api';
import onFailError from '../utils/onFailError';

export default (apiOptions, { // FIXME: remove unused properties of 2nd argument; list them all either in docs or in comments for ./index.js
  showDialog,
  hideDialog,
  navigateToDir,
  updateNotifications,
  getSelection,
  getSelectedResources,
  getResource,
  getResourceChildren,
  getResourceLocation,
  getNotifications,
  getSortState
}) => ({
  id: 'sort',
  handler: async ({ sortBy, sortDirection }) => {
    const onFail = ({ message }) => onFailError({
      getNotifications,
      label,
      notificationId: 'rename',
      updateNotifications,
      message
    });

    let id = getResource().id;
    let { resourceChildren } = await api.getChildrenForId(apiOptions, { id, sortBy, sortDirection, onFail });
    return resourceChildren;
  }
});
