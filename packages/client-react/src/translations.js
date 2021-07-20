const translations = {
  en: {
    'common.Toolbar.moveForward': 'Move forward',
    'common.Toolbar.moveBack': 'Move back',
    'common.NoFilesFoundStub.nothingToShow': 'There are no data to display',
    'common.NoFilesFoundStub.useContextMenu': 'Use toolbar or context menu to perform available actions'
  },
  fr: {
    'common.Toolbar.moveForward': 'Avancer',
    'common.Toolbar.moveBack': 'Revenir en arrière',
    'common.NoFilesFoundStub.nothingToShow': 'Aucun élément à afficher',
    'common.NoFilesFoundStub.useContextMenu': 'Utilisez la barre d\'outil ou le menu contextuel pour faire une action'
  },
  zh: {
    'common.Toolbar.moveForward': '向前',
    'common.Toolbar.moveBack': '后退',
  },
  de: {
    'common.Toolbar.moveForward': 'Vorwärts',
    'common.Toolbar.moveBack': 'Zurück',
    'common.NoFilesFoundStub.nothingToShow': 'Es gibt keine Daten, die angezeigt werden können',
    'common.NoFilesFoundStub.useContextMenu': 'Nutzen Sie die Symbolleiste oder das Kontextmenü, um die verfügbaren Aktionen auszuführen'
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
    'common.NoFilesFoundStub.nothingToShow': 'Нет данных для отображения',
    'common.NoFilesFoundStub.useContextMenu': 'Используйте доступные действия на панели инструментов или в контекстном меню'
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
