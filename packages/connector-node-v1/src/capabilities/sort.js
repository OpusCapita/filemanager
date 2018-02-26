import api from '../api';
import onFailError from '../utils/onFailError';

export default (apiOptions, {
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
  shouldBeAvailable: () => true,
  handler: async ({ sortBy, sortDirection }) => {
    const onFail = ({ message }) => onFailError({
      getNotifications,
      notificationId: 'rename',
      updateNotifications,
      message
    });

    let id = getResource().id;
    let { resourceChildren } = await api.getChildrenForId(apiOptions, { id, sortBy, sortDirection, onFail });
    return resourceChildren;
  }
});
