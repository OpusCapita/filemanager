const translations = {
  en: {
    uploading: 'Uploading',
    uploadingItem: 'Uploading 1 item',
    uploadingItems: 'Uploading {quantity} items',
    upload: 'Upload',
    remove: 'Remove',
    download: 'Download',
    rename: 'Rename',
    creating: 'Creating',
    creatingName: 'Creating {name}...',
    create: 'Create',
    createFolder: 'Create folder',
    zipping: 'Zipping',
    zippingItem: 'Zipping 1 item',
    zippingItems: 'Zipping {quantity} items',
    items: 'items',
    item: 'item',
    cancel: 'Cancel',
    confirm: 'Confirm',
    folderName: 'Folder name',
    files: 'files',
    fileExist: 'File or folder with name {name} already exists',
    newName: 'New name',
    emptyName: 'Name can\'t be empty',
    tooLongFolderName: 'Folder name can\'t contain more than 255 characters',
    folderNameNotAllowedCharacters: 'Folder name contains not allowed characters',
    title: 'Title',
    fileSize: 'File size',
    lastModified: 'Last modified',
    reallyRemove: '{files} will be deleted. Do you really want to proceed?',
    unableReadDir: 'Unable to read a directory.'
  },

  de: {
    uploading: 'Wird hochgeladen',
    uploadingItem: '1 Element wird geladen',
    uploadingItems: '{quantity} Elemente werden geladen',
    upload: 'Hochladen',
    remove: 'Löschen',
    download: 'Herunterladen',
    rename: 'Umbenennen',
    creating: 'Wird erstellt',
    creatingName: '{name} wird angelegt...',
    create: 'Erstellen',
    createFolder: 'Verzeichnis erstellen',
    zipping: 'Zippen',
    items: 'Elemente',
    item: 'Element',
    cancel: 'Stornieren',
    confirm: 'Bestätigen',
    folderName: ' Verzeichnisname',
    files: 'Dateien',
    fileExist: 'Die Datei oder Verzeichnis mit dem Namen {name} existiert bereits',
    newName: 'Neuer Name',
    emptyName: 'Der Name darf nicht leer sein',
    tooLongFolderName: 'Der Verzeichnisname darf nicht mehr als 255 Symbole enthalten',
    folderNameNotAllowedCharacters: 'Das Verzeichnisname enthält nicht erlaubte Zeichen',
    title: 'Titel',
    fileSize: 'Dateigröße',
    lastModified: 'Zuletzt geändert',
    reallyRemove: '{files}  wird/werden gelöscht. Möchten Sie wirklich fortfahren?',
    unableReadDir: 'Ein Directory kann nicht gelesen werden.'
  },
};

export default function getMessage(locale, key, params = null) {
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
