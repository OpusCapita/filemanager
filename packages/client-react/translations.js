const translations = {
  en: {
    moveForward: 'Move forward',
    moveBack: 'Move back ',
  },

  de: {
    moveForward: 'Vorwärts',
    moveBack: 'Zurück',
  }
};

export default function getMessage(locale, key, params=null) {
  let translationExists = (translations[locale] && translations[locale][key]);
  let translation = translationExists ? translations[locale][key] : translations['en'][key];
  if (params === null) {
    return translation;
  }

  let re = /{\w+}/g;
  function replace(match) {
    let replacement = match.slice(1, -1);
    return params[replacement] ? params[replacement] : '';
  }

  return translation.replace(re, replace);
}
