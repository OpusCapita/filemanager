const translations = {
  en: {
    moveForward: 'Move forward',
    moveBack: 'Move back',
  },
  fr: {
    moveForward: 'Avancer',
    moveBack: 'Revenir en arrière',
  },
  zh: {
    moveForward: '向前',
    moveBack: '后退',
  },

  de: {
    moveForward: 'Vorwärts',
    moveBack: 'Zurück',
  },
  fi: {
    moveForward: 'Siirrä eteenpäin',
    moveBack: 'Siirrä taaksepäin',
  },
  hu: {
    moveForward: 'Előre lépés',
    moveBack: 'Vissza lépés',
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
  let translation;

  if (locale && typeof locale === 'object') {
    translation = locale[key] ? locale[key] : translations['en'][key];
  } else {
    const translationExists = translations[locale] && translations[locale][key];
    translation = translationExists ? translations[locale][key] : translations['en'][key];
  }

  if (!params) {
    return translation;
  }

  const PARAM_REGEX = /{\w+}/g;
  function replace(match) {
    const replacement = match.slice(1, -1);
    return params[replacement] ? params[replacement] : '';
  }

  return translation.replace(PARAM_REGEX, replace);
}
