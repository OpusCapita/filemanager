import createFolder from './create-folder';
import deleteResource from './delete-resource';
import download from './download';
import upload from './upload';
import rename from './rename';

export default (apiOptions, { showDialog, hideDialog, forceUpdate, updateNotifications }) => ([
  createFolder(apiOptions, { showDialog, hideDialog, forceUpdate, updateNotifications }),
  rename(apiOptions, { showDialog, hideDialog, forceUpdate, updateNotifications }),
  download(apiOptions, { showDialog, hideDialog, forceUpdate, updateNotifications }),
  upload(apiOptions, { showDialog, hideDialog, forceUpdate, updateNotifications }),
  deleteResource(apiOptions, { showDialog, hideDialog, forceUpdate, updateNotifications })
]);
