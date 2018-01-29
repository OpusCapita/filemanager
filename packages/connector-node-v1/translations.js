const translations = {
  en: {
    uploading: 'Uploading',
    upload: 'Upload',
    remove: 'Remove',
    download: 'Download',
    rename: 'Rename',
    creating: 'Creating',
    create: 'Create',
    createFolder: 'Create folder',
    zipping: 'Zipping',
    items: 'items',
    item: 'item',
    cancel: 'Cancel',
    confirm: 'Confirm',
    folderName: 'Folder name',
    files: 'files',
    // TODO - add substitutions instead of splitting message in two parts
    fileExist1: 'File or folder with name',
    fileExist2: 'already exists',
    newName: 'New name',
    emptyName: 'Name can\'t be empty',
    tooLongFolderName: 'Folder name can\'t contain more than 255 characters',
    folderNameNotAllowedCharacters: 'Folder name contains not allowed characters',
    doNotRespectBill: 'We too do not respect Bill',
    title: 'Title',
    fileSize: 'File size',
    lastModified: 'Last modified',
    reallyRemove: `Do you really want to remove\n`,
    unableReadDir: `Unable to read a directory.`
  }
};

export default function getMessage(locale, key) {
  let translationExists = (translations[locale] && translations[locale][key]);

  if (!translationExists) {
    return translations['en'][key];
  }

  return translations[locale][key];
}
