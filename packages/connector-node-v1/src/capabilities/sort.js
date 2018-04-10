import api from '../api';
import onFailError from '../utils/onFailError';

export default (apiOptions, actions) => {
  const {
    // updateNotifications,
    getResource,
    // getNotifications,
    getSortState, // eslint-disable-line
    notices
  } = actions;
  return ({
    id: 'sort',
    shouldBeAvailable: () => true,
    handler: async ({ sortBy, sortDirection }) => {
      const id = getResource().id;
      try {
        return api.getChildrenForId(apiOptions, { id, sortBy, sortDirection });
      } catch (err) {
        onFailError({
          // getNotifications,
          notificationId: 'rename',
          // updateNotifications,
          notices
        });
        return null
      }
    }
  });
}
