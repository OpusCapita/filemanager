import api from '../api';

export default (apiOptions, actions) => {
  const {
    getResource,
    getSortState // eslint-disable-line
  } = actions;
  return ({
    id: 'sort',
    shouldBeAvailable: () => true,
    handler: async ({ sortBy, sortDirection }) => {
      let id = getResource().id;
      let resourceChildren = await api.getChildrenForId(apiOptions, { id, sortBy, sortDirection });
      return resourceChildren;
    }
  });
}
