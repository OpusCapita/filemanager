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
  fr: {
    uploading: 'Ajout d\'un document en cours',
    uploadingItem: 'Ajout en cours d\'un fichier',
    uploadingItems: 'Ajout en cours de {quantity} fichiers',
    upload: 'Ajouter un document',
    remove: 'Supprimer',
    download: 'Téléchargement',
    rename: 'Renommer',
    creating: 'Création',
    creatingName: 'Création {name}...',
    create: 'Créer',
    createFolder: 'Créer un dossier',
    zipping: 'Archivage',
    zippingItem: 'Archivage d\'un fichier',
    zippingItems: 'Archivage de {quantity} fichiers',
    items: 'fichiers',
    item: 'fichier',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    folderName: 'Nom du dossier',
    files: 'fichiers',
    fileExist: 'Fichier ou dossier avec ce nom {name} existe déjà',
    newName: 'Nouveau nom',
    emptyName: 'Le nom ne peut être vide',
    tooLongFolderName: 'Le nom du dossier contiens plus de 255 lettres',
    folderNameNotAllowedCharacters: 'Le nom du dossier de contiens pas assez de lettres',
    title: 'Titre',
    fileSize: 'Taille (Ko)',
    lastModified: 'Dernière modification',
    reallyRemove: '{files} vas être supprimer. Voulez vous confirmer ?',
    unableReadDir: 'Vous ne pouvez pas lire se contenue.',
    quota: "Vous n'avez plus d'espace de stockage"
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

  hu: {
    uploading: 'Feltöltés',
    uploadingItem: '1 elem feltöltése',
    uploadingItems: '{quantity} elem feltöltése',
    upload: 'Feltöltés',
    remove: 'Törlés',
    downloadingName: '{name} letöltése...',
    downloadingItem: '1 elem letöltése',
    downloadingItems: '{quantity} elem letöltése',
    download: 'Letöltés',
    rename: 'Átnevezés',
    creating: 'Létrehozás',
    creatingName: '{name} létrehozása...',
    create: 'Létrehoz',
    createFolder: 'Mappa létrehozása',
    items: 'elemek',
    item: 'elem',
    error: 'hiba',
    folderName: 'Mappa neve',
    fileExist: 'Fájl vagy mappa {name} névvel nem létezik',
    newName: 'Új név',
    emptyName: 'Név nem lehet üres',
    tooLongFolderName: 'Mappa neve nem lehet 255 karakternél hosszabb',
    notAllowedCharacters: 'A név tiltott karaktereket tartalmaz',
    doNotRespectBill: 'We too do not respect Bill', // en
    title: 'Cím',
    fileSize: 'Fájl mérete',
    lastModified: 'Utoljára módosítva',
    signInSuccess: 'Sikeres bejelentkezés a Google Drive-ba',
    signInFail: 'Bejelentkezés a Google Drive-ba sikertelen',
    notInitAPIClient: 'Nem inicializálható a Google API kliens',
    successInit: 'Google API kliens sikeresen inicializálva',
  },
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
