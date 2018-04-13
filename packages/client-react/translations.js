const translations = {
  en: {
    moveForward: 'Move forward',
    moveBack: 'Move back',
  },

  de: {
    moveForward: 'Vorwärts',
    moveBack: 'Zurück',
  },
  fi: {
    moveForward: 'Siirrä eteenpäin',
    moveBack: 'Siirrä taaksepäin',
  },
  ru: {
    moveForward: 'Переместить вперед',
    moveBack: 'Переместить назад',
  },
  no: {
    moveForward: 'Flytt fremover',
    moveBack: 'Flytt bakover',
  },
  sv: {
    moveForward: 'Flytta framåt',
    moveBack: 'Flytta bakåt',
  }
};

export default function getMessage(locale, key, params) {
  let translationExists = (translations[locale] && translations[locale][key]);
  let translation = translationExists ? translations[locale][key] : translations['en'][key];
  if (!params) {
    return translation;
  }

  let re = /{\w+}/g;
  function replace(match) {
    let replacement = match.slice(1, -1);
    return params[replacement] ? params[replacement] : '';
  }

  return translation.replace(re, replace);
}
