const translations = {
  en: {
    moveForward: 'Move forward',
    moveBack: 'Move back',
    nothingToShow: 'Nothing to show',
    useContextMenu: 'Use toolbar or context menu to perform available actions'
  },
  fr: {
    moveForward: 'Avancer',
    moveBack: 'Revenir en arrière',
    nothingToShow: 'Aucun élément à afficher',
    useContextMenu: 'Utilisez la barre d\'outil ou le menu contextuel pour faire une action'
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
