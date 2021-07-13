const translations = {
  en: {
    'common.Toolbar.moveForward': 'Move forward',
    'common.Toolbar.moveBack': 'Move back',
    'nothingToShow': 'Nothing to show',
    'useContextMenu': 'Use toolbar or context menu to perform available actions'
  },
  fr: {
    'common.Toolbar.moveForward': 'Avancer',
    'common.Toolbar.moveBack': 'Revenir en arrière',
    'nothingToShow': 'Aucun élément à afficher',
    'useContextMenu': 'Utilisez la barre d\'outil ou le menu contextuel pour faire une action'
  },
  zh: {
    'common.Toolbar.moveForward': '向前',
    'common.Toolbar.moveBack': '后退',
  },

  de: {
    'common.Toolbar.moveForward': 'Vorwärts',
    'common.Toolbar.moveBack': 'Zurück',
  },
  fi: {
    'common.Toolbar.moveForward': 'Siirrä eteenpäin',
    'common.Toolbar.moveBack': 'Siirrä taaksepäin',
  },
  hu: {
    'common.Toolbar.moveForward': 'Előre lépés',
    'common.Toolbar.moveBack': 'Vissza lépés',
  },
  ru: {
    'common.Toolbar.moveForward': 'Переместить вперед',
    'common.Toolbar.moveBack': 'Переместить назад',
  },
  no: {
    'common.Toolbar.moveForward': 'Flytt fremover',
    'common.Toolbar.moveBack': 'Flytt bakover',
  },
  sv: {
    'common.Toolbar.moveForward': 'Flytta framåt',
    'common.Toolbar.moveBack': 'Flytta bakåt',
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
