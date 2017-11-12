import api from '../api';

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
  getNotifications,
  getSortState
}) => ({
  id: 'sort',
  handler: async ({ sortBy, sortDirection }) => {
    let id = getResource().id;
    let { resourceChildren } = await api.getChildrenForId(apiOptions, id, sortBy, sortDirection);
    return resourceChildren;
  }
});
