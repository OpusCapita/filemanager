import api from '../api';
import sanitizeFilename from 'sanitize-filename';
import onFailError from '../utils/onFailError';
import icons from '../icons-svg';
import getMess from '../translations';

const label = 'edit';

function handler(apiOptions, actions) {
  const {
    showDialog,
    hideDialog,
    navigateToDir,
    updateNotifications,
    getSelectedResources,
    getResource,
    getNotifications
  } = actions;

  const getMessage = getMess.bind(null, apiOptions.locale);
  const localeLabel = getMessage(label);

  const selectedResources = getSelectedResources();
  const filesizelimit = 100;
  if (selectedResources[0].size / 1024 > filesizelimit) {
    onFailError({
      getNotifications,
      label: localeLabel,
      notificationId: label,
      updateNotifications,
      message: getMessage('editFileLimit', {filesizelimit})
    });
    return;
  }

  const rawDialogElement = {
    elementType: 'EditDialog',
    elementProps: {
      readOnly: false,
      onHide: hideDialog,
      onSubmit: async (text) => {
        const onProgress = (progress) => {};
        const selectedResources = getSelectedResources();
//        alert('' + JSON.stringify(atob(selectedResources[0].id)));
        try {
          hideDialog();
          const resource = getResource();
          var data = new Blob([text]);
          const file = {
            name: selectedResources[0].name,
            file: data
          };
          const result = await api.uploadFileToId({ apiOptions, parentId: resource.id, file, onProgress, overwrite: true });
//          alert('111' + result.body[0].id);
          navigateToDir(resource.id, selectedResources[0].id, false);
          return null;
        } catch (err) {
          hideDialog();
          onFailError({
            getNotifications,
            label: localeLabel,
            notificationId: label,
            updateNotifications
          });
          console.log(err);
          return null
        }
      },
      getFileContent: async () => {
        const onProgress = (progress) => {};
        const resources = getSelectedResources();
        const content = await api.downloadResources({ resources, apiOptions, onProgress});
        return content.text();
      },
      headerText: getMessage('file') + ": " + getSelectedResources()[0].name,
      fileName: getSelectedResources()[0].name
    }
  };
  showDialog(rawDialogElement);
}

export default (apiOptions, actions) => {
  const localeLabel = getMess(apiOptions.locale, label);
  const { getSelectedResources } = actions;
  return {
    id: label,
    icon: { svg: icons.edit },
    label: localeLabel,
    shouldBeAvailable: (apiOptions) => {
      const selectedResources = getSelectedResources();
      return (
        selectedResources.length === 1 &&
        selectedResources.every(r => r.capabilities.canEdit)
      );
    },
    availableInContexts: ['row', 'toolbar'],
    handler: () => handler(apiOptions, actions)
  };
}
