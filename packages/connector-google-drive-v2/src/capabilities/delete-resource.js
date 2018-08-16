import icons from '../icons-svg';
import getMessage from '../translations';

const label = 'remove';

function handler(apiOptions, actions) {
  //
}

export default (apiOptions, actions) => {
  const localeLabel = getMessage(apiOptions.locale, label);
  return {
    id: 'delete',
    icon: { svg: icons.delete },
    label: localeLabel,
    title: localeLabel,
    shouldBeAvailable: (apiOptions) => {
      return false;
    },
    availableInContexts: ['row', 'toolbar'],
    handler: () => handler(apiOptions, actions)
  };
}
