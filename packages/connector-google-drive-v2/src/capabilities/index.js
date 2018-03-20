import createFolder from './create-folder';
// "deleteResource" disabled couse not implemented yet
// import deleteResource from './delete-resource';
import download from './download';
import upload from './upload';
import rename from './rename';
import sort from './sort';

export default (apiOptions, {
  showDialog,
  hideDialog,
  navigateToDir,
  updateNotifications,
  getSelection,
  getSelectedResources,
  getResource,
  getResourceChildren,
  getResourceLocation,
  getNotifications,
  getSortState
}) => ([
  createFolder(apiOptions, {
    showDialog,
    hideDialog,
    navigateToDir,
    updateNotifications,
    getSelection,
    getSelectedResources,
    getResource,
    getResourceChildren,
    getResourceLocation,
    getNotifications,
    getSortState
  }),
  rename(apiOptions, {
    showDialog,
    hideDialog,
    navigateToDir,
    updateNotifications,
    getSelection,
    getSelectedResources,
    getResource,
    getResourceChildren,
    getResourceLocation,
    getNotifications,
    getSortState
  }),
  download(apiOptions, {
    showDialog,
    hideDialog,
    navigateToDir,
    updateNotifications,
    getSelection,
    getSelectedResources,
    getResource,
    getResourceChildren,
    getResourceLocation,
    getNotifications,
    getSortState
  }),
  upload(apiOptions, {
    showDialog,
    hideDialog,
    navigateToDir,
    updateNotifications,
    getSelection,
    getSelectedResources,
    getResource,
    getResourceChildren,
    getResourceLocation,
    getNotifications,
    getSortState
  }),
  // "deleteResource" disabled couse not implemented yet

  // deleteResource(apiOptions, {
  //   showDialog,
  //   hideDialog,
  //   navigateToDir,
  //   updateNotifications,
  //   getSelection,
  //   getSelectedResources,
  //   getResource,
  //   getResourceChildren,
  //   getResourceLocation,
  //   getNotifications,
  //   getSortState
  // }),
  sort(apiOptions, {
    showDialog,
    hideDialog,
    navigateToDir,
    updateNotifications,
    getSelection,
    getSelectedResources,
    getResource,
    getResourceChildren,
    getResourceLocation,
    getNotifications,
    getSortState
  })
]);
