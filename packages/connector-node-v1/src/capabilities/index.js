import createFolder from './create-folder';
import deleteResource from './delete-resource';
import download from './download';
import upload from './upload';
import rename from './rename';
import sort from './sort';

const capabilities = [
  createFolder,
  rename,
  download,
  upload,
  deleteResource,
  sort
];

/**
 * Actions' fields list:
 *  notices,
 *  showDialog,
 *  hideDialog,
 *  navigateToDir,
 *  getSelection,
 *  getSelectedResources,
 *  getResource,
 *  getResourceChildren,
 *  getResourceLocation,
 *  getSortState
 *
 *  Called from FileNavigator (componentDidMount() and componentWillReceiveProps())
 *
 * @param apiOptions
 * @param {object} actions
 * @returns {array}
 */
export default (apiOptions, actions) => (
  capabilities.map(capability => capability(apiOptions, actions))
);
