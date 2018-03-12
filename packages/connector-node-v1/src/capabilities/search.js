import api from '../api';
import sanitizeFilename from 'sanitize-filename';
import onFailError from '../utils/onFailError';
import icons from '../icons-svg';
import getMess from '../../translations';

const icon = icons.search; // TODO: add "search" icon
const label = 'search';

function handler(apiOptions, {
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
  listResources // TODO: implement listResources()
}) {
  const getMessage = getMess.bind(null, apiOptions.locale);

  const rawDialogElement = {
    elementType: 'SearchDialog', // TODO: assign correct name
    elementProps: {
      onHide: hideDialog,
      onSubmit: async ({ itemNameSubstring, itemNameCaseSensitive, itemType, recursive }) => {
        hideDialog();
        let stepIndex = 0;

        try {
          const resources = await api.searchForResources({
            options: apiOptions,
            resourceId: getResource().id,
            itemNameSubstring: itemNameSubstring.trim(),
            itemNameCaseSensitive,
            isFile: itemType.file,
            isDir: itemType.dir,
            recursive,
            onProgress: resources => listResources({
              resources,
              // boolean whether replace existing listing or add to existing listing:
              continuous: !!stepIndex++,
              // boolean whether the chunk is last one:
              final: false
            })
          });
          listResources({ resources, continuous: !!stepIndex, final: true });
        } catch (err) {
          console.error(`Filemanager.searchForResources()`, err);
          onFailError({
            getNotifications,
            label: getMessage(label),
            notificationId: label,
            updateNotifications
          });
        }
      },
      onValidate: async ({ itemNameSubstring, itemType }) => {
        if (itemNameSubstring.length >= 255) {
          return getMessage('tooLongFolderName');
        } else if (itemNameSubstring.trim() !== sanitizeFilename(itemNameSubstring.trim())) {
          return getMessage('folderNameNotAllowedCharacters');
        }
        if (!itemType.file && !itemType.dir) {
          return getMessage('specifyItemType');
        }
        return null;
      }
    }
  };
  showDialog(rawDialogElement);
}

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
  getNotifications
}) => {
  const localeLabel = getMess(apiOptions.locale, label);
  return {
    id: label,
    icon: { svg: icon },
    label: localeLabel,
    shouldBeAvailable: (apiOptions) => {
      const resource = getResource();

      if (!resource || !resource.capabilities) {
        return false;
      }

      return resource.capabilities.canListChildren;
    },
    availableInContexts: ['toolbar'],
    handler: () => handler(apiOptions, {
      showDialog,
      hideDialog,
      navigateToDir,
      updateNotifications,
      getSelection,
      getSelectedResources,
      getResource,
      getResourceChildren,
      getResourceLocation,
      getNotifications
    }),
    contextMenuRenderer: (apiOptions) => ({
      elementType: 'ContextMenuItem',
      elementProps: {
        icon: { svg: icon },
        onClick: () => handler(apiOptions, {
          showDialog,
          hideDialog,
          navigateToDir,
          updateNotifications,
          getSelection,
          getSelectedResources,
          getResource,
          getResourceChildren,
          getResourceLocation,
          getNotifications
        }),
        children: localeLabel
      }
    })
  };
}
