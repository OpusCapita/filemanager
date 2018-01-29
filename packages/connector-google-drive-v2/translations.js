const translations = {
  en: {
    uploading: 'Uploading',
    upload: 'Upload',
    remove: 'Remove',
    downloading: 'Downloading',
    download: 'Download',
    rename: 'Rename',
    creating: 'Creating',
    create: 'Create',
    createFolder: 'Create folder',
    items: 'items',
    item: 'item',
    error: 'error',
    folderName: 'Folder name',
    // TODO - add substitutions instead of splitting message in two parts
    fileExist1: 'File or folder with name',
    fileExist2: 'already exists',
    newName: 'New name',
    emptyName: 'Name can\'t be empty',
    tooLongName: 'Name can\'t contain more than 255 characters',
    notAllowedCharacters: 'Name contains not allowed characters',
    doNotRespectBill: 'We too do not respect Bill',
    title: 'Title',
    fileSize: 'File size',
    lastModified: 'Last modified',
    signInSuccess: 'Google Drive sign-in success',
    signInFail: 'Google Drive sign-in fail',
    notInitAPIClient: 'Can\'t init Google API client',
    successInit: 'Google API client successfully initialized'
  }
};

export default function getMessage(locale, key) {
  let translationExists = (translations[locale] && translations[locale][key]);

  if (!translationExists) {
    return translations['en'][key];
  }

  return translations[locale][key];
}
