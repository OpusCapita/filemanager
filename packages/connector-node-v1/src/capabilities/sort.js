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
    const onFail = _ => onFailError({
      getNotifications,
      notificationId: 'rename',
      updateNotifications
    });
    const id = getResource().id;
    try {
      const { resourceChildren } = await api.getChildrenForId(apiOptions, { id, sortBy, sortDirection });
      return resourceChildren;
    } catch (err) {
      onFail()
      return null
    }
  }
});
