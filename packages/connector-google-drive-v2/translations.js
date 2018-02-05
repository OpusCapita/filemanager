const translations = {
  en: {
    uploading: 'Uploading',
    uploadingItem: 'Uploading 1 item',
    uploadingItems: 'Uploading {quantity} items',
    upload: 'Upload',
    remove: 'Remove',
    downloadingName: 'Downloading {name}...',
    downloadingItem: 'Downloading 1 item',
    downloadingItems: 'Downloading {quantity} items',
    download: 'Download',
    rename: 'Rename',
    creating: 'Creating',
    creatingName: 'Creating {name}...',
    create: 'Create',
    createFolder: 'Create folder',
    items: 'items',
    item: 'item',
    error: 'error',
    folderName: 'Folder name',
    fileExist: 'File or folder with name {name} already exists',
    newName: 'New name',
    emptyName: 'Name can\'t be empty',
    tooLongName: 'Name can\'t contain more than 255 characters',
    notAllowedCharacters: 'Name contains not allowed characters',
    doNotRespectBill: 'We too do not respect Bill', // en
    title: 'Title',
    fileSize: 'File size',
    lastModified: 'Last modified',
    signInSuccess: 'Google Drive sign-in was successful',
    signInFail: 'Google Drive sign-in failed',
    notInitAPIClient: 'Google API client cannot be initialized',
    successInit: 'Google API client successfully initialized',
  },

  de: {
    uploading: 'Wird hochgeladen',
    uploadingItem: '1 Element wird geladen',
    uploadingItems: '{quantity} Elemente werden geladen',
    upload: 'Hochladen',
    remove: 'Löschen',
    downloadingName: '{name} wird hochgeladen...',
    downloadingItem: '1 Element wird hochgeladen',
    downloadingItems: '{quantity} Elemente werden hochgeladen',
    download: 'Herunterladen',
    rename: 'Umbenennen',
    creating: 'Wird erstellt',
    create: 'Erstellen',
    createFolder: 'Verzeichnis erstellen',
    creatingName: '{name} wird angelegt...',
    items: 'Elemente',
    item: 'Element',
    error: 'Fehler',
    folderName: ' Verzeichnisname',
    fileExist: 'Die Datei oder Verzeichnis mit dem Namen {name} existiert bereits',
    newName: 'Neuer Name',
    emptyName: 'Der Name darf nicht leer sein',
    tooLongName: 'Der Verzeichnisname darf nicht mehr als 255 Symbole enthalten',
    notAllowedCharacters: 'Der Name des Verzeichnisses enthält nicht erlaubte Zeichen',
    doNotRespectBill: 'We too do not respect Bill', // en
    title: 'Titel',
    fileSize: 'Dateigröße',
    lastModified: 'Zuletzt geändert',
    signInSuccess: 'Google Drive-Anmeldung erfolgreich',
    signInFail: 'Google Drive-Anmeldung fehlgeschlagen',
    notInitAPIClient: 'Google API-Client konnte nicht initialisiert werden',
    successInit: 'Google API-Client wurde erfolgreich initialisiert',
  },
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
