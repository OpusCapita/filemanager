let capabilities = (apiOptions) => ({
  canDownload: {
    title: 'Download',
    handler: (apiOptions, resourceIds, params) => {},
    multiple: true
  },
  canDelete: {
    title: 'Download',
    handler: (apiOptions, resourceIds, params) => {},
    multiple: true
  }
});

export default {
  capabilities
};
