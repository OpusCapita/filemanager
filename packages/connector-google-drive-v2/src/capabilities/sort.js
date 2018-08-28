import api from '../api';

export default (apiOptions, actions) => {
  const {
    getResource,
    getSortState // eslint-disable-line no-unused-vars
  } = actions;
  return ({
    id: 'sort',
    shouldBeAvailable: () => true,
    handler: async ({ sortBy, sortDirection }) => {
      const id = getResource().id;
      const resourceChildren = await api.getChildrenForId(apiOptions, { id, sortBy, sortDirection });
      return resourceChildren;
    }
  });
}
