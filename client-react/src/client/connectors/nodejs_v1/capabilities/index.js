import createFolder from './create-folder';
import deleteResource from './delete-resource';
import download from './download';
import upload from './upload';
import rename from './rename';

export default (apiOptions, { showDialog, hideDialog, forceUpdate }) => ([
  createFolder(apiOptions, { showDialog, hideDialog, forceUpdate }),
  rename(apiOptions, { showDialog, hideDialog, forceUpdate }),
  download(apiOptions, { showDialog, hideDialog, forceUpdate }),
  upload(apiOptions, { showDialog, hideDialog, forceUpdate }),
  deleteResource(apiOptions, { showDialog, hideDialog, forceUpdate })
]);
