import agent from 'superagent';
import JSZip from 'jszip';
import { serializePromises } from './utils/common';
import { getDownloadParams } from './google-drive-utils';
import parseRange from 'range-parser';

async function appendGoogleApiScript() {
  if (window.gapi) {
    return false;
  }

  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.addEventListener('load', () => {
      console.log('Google API Script successfully fetched');
      resolve();
    });
    script.addEventListener('error', (error) => {
      console.log('Can\'t fetch Google API Script', error);
      reject(error);
    });
  });
}

/**
 * Load the auth2 library.
 *
 * @returns {Promise<any>}
 */
function loadAuth2Library() {
  return new Promise(resolve => {
    window.gapi.load('client:auth2', () => resolve());
  });
}

/**
 * hasSignedIn
 *
 * @returns {boolean}
 */
function hasSignedIn() {
  return window.gapi.auth2.getAuthInstance().isSignedIn.get();
}

/**
 * Initializes the API client library and sets up sign-in state listeners.
 *
 * @param options
 * @returns {Promise<{}>}
 */
async function initClient(options) {
  // This code doesn't work in IE11
  await window.gapi.client.init({
    apiKey: options.API_KEY,
    clientId: options.CLIENT_ID,
    discoveryDocs: options.DISCOVERY_DOCS,
    scope: options.SCOPES
  });
  // End of not working code

  if (!window.gapi.auth2.getAuthInstance()) {
    console.log('Can\'t init Google API client');
    return {
      apiInitialized: false,
      apiSignedIn: false
    };
  }

  let isSignedIn = hasSignedIn();

  if (isSignedIn) {
    console.log('Google Drive sign-in Success');
  } else {
    console.log('Google Drive sign-in fail');
  }

  return {
    apiInitialized: true,
    apiSignedIn: isSignedIn
  };
}

/**
 * Init Google API
 *
 * @param options
 * @returns {Promise<{apiInitialized: boolean, apiSignedIn: boolean}>}
 */
async function init(options) {
  await appendGoogleApiScript();
  await loadAuth2Library();
  console.log('Try auth on Google Drive API');
  return await initClient(options); // Initializes API client library.
}

/**
 * Normalize Resource
 *
 * @param resource
 * @returns {{}} Normalized resource
 */
function normalizeResource(resource) {
  return {
    createdDate: Date.parse(resource.createdDate),
    id: resource.id,
    modifiedDate: Date.parse(resource.modifiedDate),
    title: resource.title,
    type: resource.mimeType === 'application/vnd.google-apps.folder' ? 'dir' : 'file',
    size: typeof resource.fileSize === 'undefined' ? resource.fileSize : parseInt(resource.fileSize, 10),
    parents: resource.parents,
    capabilities: resource.capabilities,
    downloadUrl: resource.downloadUrl,
    mimeType: resource.mimeType,
    exportLinks: resource.exportLinks
  };
}

async function getResourceById(options, id) {
  let response = await window.gapi.client.drive.files.get({
    fileId: id
    // fields: 'createdDate,id,modifiedDate,title,mimeType,fileSize,parents,capabilities,downloadUrl'
  });
  let resource = normalizeResource({ ...response.result });
  return resource;
}

async function getParentsForId(options, id, result = []) {
  if (id === 'root') {
    return result;
  }

  let response = await window.gapi.client.drive.parents.list({
    fileId: id
    // fields: 'items(id)'
  });
  let parentId = typeof response.result.items[0] === 'undefined' ? 'root' : response.result.items[0].id;

  if (parentId === 'root') {
    return result;
  }

  let parent = await getResourceById(options, parentId);
  return await getParentsForId(options, parentId, [parent].concat(result));
}

async function getParentIdForResource(options, resource) {
  if (!resource.parents.length) {
    return 'root';
  }

  return resource.parents[0].id;
}

async function getChildrenForId(options, { id, sortBy = 'title', sortDirection = 'ASC' }) {
  let response = await window.gapi.client.drive.files.list({
    q: `'${id}' in parents and trashed = false`,
    orderBy: `folder,${sortBy} ${sortDirection === 'ASC' ? '' : 'desc'}`
    // fields: 'items(createdDate,id,modifiedDate,title,mimeType,fileSize,parents,capabilities,downloadUrl)'
  });
  return response.result.items.map((o) => normalizeResource({ ...o }));
}

async function getCapabilitiesForResource(options, resource) {
  return resource.capabilities || [];
}

async function downloadResource({ resource, params, onProgress, i = 0, l = 1 }) {
  let accessToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

  const { downloadUrl, direct, mimeType, fileName } = params;

  if (direct) {
    return {
      downloadUrl,
      direct,
      mimeType
    }
  }

  let res;

  try {
    res = await agent.get(downloadUrl).
      set('Authorization', `Bearer ${accessToken}`).
      responseType('blob').
      on('progress', event => {
        onProgress((i * 100 + event.percent) / l)
      });
  } catch (err) {
    throw new Error(`Failed to download resource: ${err}`);
  }

  return {
    direct,
    file: res.body,
    fileName
  };
}

async function downloadResources({ resources, apiOptions, onProgress }) {
  // multiple resources -> download one by one
  const files = await serializePromises({
    series: resources.map(
      resource => ({ onProgress, i, l }) => downloadResource({
        resource,
        params: {
          ...getDownloadParams(resource),
          direct: false
        },
        onProgress, i, l
      })
    ),
    onProgress
  });

  onProgress(100);

  const zip = new JSZip();
  // add generated files to a zip bundle
  files.forEach(({ fileName, file }) => zip.file(fileName, file));

  const blob = await zip.generateAsync({ type: 'blob' });

  return {
    direct: false,
    file: blob,
    fileName: apiOptions.archiveName || 'archive.zip'
  }
}

async function initResumableUploadSession({ name, size, parentId }) {
  let accessToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
  let uploadUrl = `https://www.googleapis.com/upload/drive/v2/files?uploadType=resumable`;

  let res = await agent.post(uploadUrl).
    set('Authorization', `Bearer ${accessToken}`).
    set('X-Upload-Content-Length', size).
    send({ title: name, parents: [{ id: parentId }] });

  return res.headers['location'];
}

async function uploadChunk({ sessionUrl, size, startByte, content }) {
  return new Promise((resolve, reject) => {
    let chunkSize = 256 * 1024 * 2;
    let endByte = startByte + chunkSize < size ? startByte + chunkSize : size;

    agent.put(sessionUrl).
      set('Content-Range', `bytes ${startByte}-${endByte - 1}/${size}`).
      set('Content-Encoding', 'base64').
      send(btoa(content.slice(startByte, endByte))).
      end((err, res) => {
        // if (err) { } // pass
        resolve(res);
      });
  });
}

async function getRootId() {
  return 'root';
}

async function uploadFileToId(parentId, file, onProgress) {
  let size = file.content.length;
  let sessionUrl = await initResumableUploadSession({ name: file.name, size, parentId });
  let startByte = 0;

  while (startByte < size) {
    let res = await uploadChunk({
      sessionUrl,
      size,
      startByte,
      content: file.content
    });

    if (res.status === 308) {
      let range = parseRange(size, res.headers['range']);
      startByte = range[0].end + 1;

      let progress = startByte / (size / 100);
      onProgress(progress);
    }

    if (res.status === 200 || res.status === 201) {
      return res;
    }
  }

  return null;
}

async function createFolder(apiOptions, parentId, folderName) {
  return await window.gapi.client.drive.files.insert({
    title: folderName,
    parents: [{ id: parentId }],
    mimeType: 'application/vnd.google-apps.folder'
  });
}

async function renameResource(apiOptions, id, newName) {
  return await window.gapi.client.drive.files.patch({
    fileId: id,
    title: newName
  });
}

function getResourceName(apiOptions, resource) {
  return resource.title;
}

async function removeResources() {

}

async function signIn() {
  window.gapi.auth2.getAuthInstance().signIn();
}

async function signOut() {
  window.gapi.auth2.getAuthInstance().signOut();
}

export default {
  init,
  hasSignedIn,
  getResourceById,
  getChildrenForId,
  getRootId,
  getParentsForId,
  getParentIdForResource,
  getCapabilitiesForResource,
  getResourceName,
  createFolder,
  downloadResource,
  downloadResources,
  uploadFileToId,
  renameResource,
  removeResources,
  signIn,
  signOut
};
