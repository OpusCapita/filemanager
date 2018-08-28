import api from '../api';
import sanitizeFilename from 'sanitize-filename';
import icons from '../icons-svg';
import getMess from '../translations';

let label = 'open';

function handler(apiOptions, actions) {
  const {
    navigateToDir,
    getSelectedResources
  } = actions;

  const selectedResources = getSelectedResources();
  const selectedResourceId = selectedResources[0].id;
  navigateToDir(selectedResourceId)
}

export default (apiOptions, actions) => {
  const localeLabel = getMess(apiOptions.locale, label);
  const { getSelectedResources } = actions;
  return {
    id: label,
    icon: { svg: icons.open },
    label: localeLabel,
    shouldBeAvailable: (apiOptions) => {
      let selectedResources = getSelectedResources();
      return (
        selectedResources.length === 1 &&
        selectedResources[0].type === 'dir'
      );
    },
    availableInContexts: ['row', 'toolbar'],
    handler: () => handler(apiOptions, actions)
  };
}
