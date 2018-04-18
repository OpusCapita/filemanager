import api from '../api';
import onFailError from '../utils/onFailError';
import icons from '../icons-svg';
import getMessage from '../translations';

const label = 'search';

const handler = (apiOptions, {
  showDialog,
  hideDialog,
  updateNotifications,
  getResource,
  getNotifications,
  navigateToDir
}) => {
  const getLocaleMessage = getMessage.bind(null, apiOptions.locale);
  let abortSearching = _ => {};

  const dialog = showDialog({
    elementType: 'SearchDialog',
    elementProps: {
      onHide: (...args) => {
        abortSearching();
        hideDialog(...args);
      },
      onSubmit: async ({ itemNameSubstring, itemNameCaseSensitive, itemType, recursive }) => {
        abortSearching();
        let stepIndex = 0;

        const { promise, abort } = api.searchForResources({
          options: apiOptions,
          resourceId: getResource().id,
          itemNameSubstring: itemNameSubstring.trim(),
          itemNameCaseSensitive,
          isFile: itemType.file,
          isDir: itemType.dir,
          recursive,
          onProgress: resources => dialog({
            resources,
            stepIndex: stepIndex++,

            // boolean whether the chunk is last one:
            final: false
          })
        });

        abortSearching = abort;

        try {
          dialog({
            resources: await promise,
            stepIndex,
            final: true
          });
        } catch (err) {
          if (!err.aborted) {
            onFailError({
              getNotifications,
              label: getLocaleMessage(label),
              notificationId: label,
              updateNotifications
            });
            dialog({ err });
          }
        }
      },
      headerText: getMessage('searchWithinFolder'),
      itemNameSubstringText: getMessage('itemName'),
      itemNameCaseSensitiveText: getMessage('caseSensitive'),
      recursiveText: getMessage('recursive'),
      itemTypeText: getMessage('itemType'),
      itemTypeFileText: getMessage('files'),
      itemTypeDirText: getMessage('folders'),
      cancelButtonText: getMessage('cancel'),
      submitButtonText: getMessage('search'),
      navigateToDir
    }
  });
}

export default (apiOptions, actions) => ({
  id: label,
  icon: { svg: icons.search },
  label: getMessage(apiOptions.locale, label),
  shouldBeAvailable: _ => {
    const resource = actions.getResource();

    if (!resource || !resource.capabilities) {
      return false;
    }

    return resource.capabilities.canListChildren;
  },
  availableInContexts: ['toolbar'],
  handler: _ => handler(apiOptions, actions)
});
