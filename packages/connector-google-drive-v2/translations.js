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
    fileExist: 'File or folder with name {name} already exists',
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
