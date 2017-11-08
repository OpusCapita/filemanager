import agent from 'superagent';
import { downloadFile } from '../utils/download';
import { readLocalFile } from '../utils/upload';
import { getExportMimeType, checkIsGoogleDocument } from './google-drive-utils';
import parseRange from 'range-parser';

let signedIn = false;

async function appendGoogleApiScript() {
  if (window.gapi) {
    return false;
  };

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

async function updateSigninStatus(isSignedIn, options) {
  if (isSignedIn) {
    options.onSignInSuccess('Google Drive sign-in success');
    console.log('Google Drive sign-in Success');
  } else {
    options.onSignInFail('Google Drive sign-in fail');
    console.log('Google Drive sign-in fail');
  }

  signedIn = isSignedIn;
}

// Initializes the API client library and sets up sign-in state listeners.
async function initClient(options) {
  await window.gapi.client.init({
    apiKey: options.API_KEY,
    clientId: options.CLIENT_ID,
    discoveryDocs: options.DISCOVERY_DOCS,
    scope: options.SCOPES
  });

  if (!window.gapi.auth2.getAuthInstance()) {
    options.onInitFail('Can\'t init Google API client');
    console.log('Can\'t init Google API client');
    return;
  }

  options.onInitSuccess('Google API client successfully initialized');
  // Listen for sign-in state changes.
  window.gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => updateSigninStatus(isSignedIn, options));

  // Handle the initial sign-in state.
  updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get(), options);
}

// On load, called to load the auth2 library and API client library.
async function handleClientLoad(options) {
  await window.gapi.load('client:auth2', () => initClient(options));
}

async function init(options) {
  await appendGoogleApiScript();

  console.log('Try auth on Google Drive API');
  await handleClientLoad(options);
}

function normalizeResource(resource) {
  return {
    createDate: Date.parse(resource.createdDate),
    id: resource.id,
    modifyDate: Date.parse(resource.modifiedDate),
    title: resource.title,
    type: resource.mimeType === 'application/vnd.google-apps.folder' ? 'dir' : 'file',
    size: typeof resource.fileSize === 'undefined' ? resource.fileSize : parseInt(resource.fileSize),
    parents: resource.parents,
    capabilities: resource.capabilities,
    downloadUrl: resource.downloadUrl,
    mimeType: resource.mimeType,
    exportLinks: resource.exportLinks
  };
}

async function pathToId(path) {
}

async function idToPath(id) {
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

async function getChildrenForId(options, id) {
  let response =  await window.gapi.client.drive.files.list({
    q: `'${id}' in parents and trashed = false`
    // fields: 'items(createdDate,id,modifiedDate,title,mimeType,fileSize,parents,capabilities,downloadUrl)'
  });

  let resourceChildren = response.result.items.map((o) => normalizeResource({ ...o }));
  return { resourceChildren };
}

async function getCapabilitiesForResource(options, resource) {
  return resource.capabilities || [];
}

async function downloadResource(resource) {
  let { mimeType } = resource;
  let accessToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
  let isGoogleDocument = checkIsGoogleDocument(mimeType);

  let downloadUrl = '';
  let title = '';
  let content = '';
  if (isGoogleDocument) {
    let { exportMimeType, extension } = getExportMimeType(mimeType);
    downloadUrl = resource.exportLinks[exportMimeType];
    title = `${resource.title}.${extension}`;
  } else {
    downloadUrl = `https://www.googleapis.com/drive/v2/files/${resource.id}?alt=media`;
    title = resource.title;
  }

  agent.get(downloadUrl).
    set('Authorization', `Bearer ${accessToken}`).
    responseType('blob').
    end((err, res) => {
      if (err) {
        return console.error('Failed to download resource:', err);
      }
      downloadFile(res.body, title);
    });
}

async function downloadResources(resources) {
  if (resources.length === 1) {
    return downloadResource(resources[0]);
  }

  resources.forEach(async (resource) => {

  });
}

async function initResumableUploadSession({ name, size, parentId }) {
  let accessToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
  let uploadUrl = `https://www.googleapis.com/upload/drive/v2/files?uploadType=resumable`;

  let res = await agent.post(uploadUrl).
    set('Authorization', `Bearer ${accessToken}`).
    set('X-Upload-Content-Length', size).
    send({ title: name, parents: [parentId] });

  return res.headers['location'];
}

async function uploadChunk({ sessionUrl, size, startByte, content }) {
  return new Promise((resolve, reject) => {
    let chunkSize = 256 * 1024 * 10;
    let endByte = startByte + chunkSize < size ? startByte + chunkSize : size;

    agent.put(sessionUrl).
      set('Content-Range', `bytes ${startByte}-${endByte - 1}/${size}`).
      set('Content-Encoding', 'base64').
      send(btoa(content.slice(startByte, endByte))).
      end((err, res) => {
        if (err) {} // pass
        resolve(res);
      });
  });
}

async function uploadFileToId(parentId) {
  let file =  await readLocalFile();
  let size = file.content.length;
  let sessionUrl = await initResumableUploadSession({ name: file.name, size, parentId: 'root' });
  let startByte = 0;

  while(startByte < size) {
    let res = await uploadChunk({
      sessionUrl,
      size,
      startByte,
      content: file.content
    });

    if (res.status === 308) {
      let range = parseRange(size, res.headers['range']);
      startByte = range[0].end + 1;
    }

    if (res.status === 200 || res.status === 201) {
      return res;
    }
  }
}

async function createFolder(apiOptions, parentId, folderName) {
  await window.gapi.client.drive.files.insert({
    title: folderName,
    parents: [{ id: parentId }],
    mimeType: 'application/vnd.google-apps.folder'
  });
}

async function renameResource(apiOptions, id, newName) {
  await window.gapi.client.drive.files.patch({
    fileId: id,
    title: newName
  });
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
  pathToId,
  idToPath,
  getResourceById,
  getChildrenForId,
  getParentsForId,
  getParentIdForResource,
  getCapabilitiesForResource,
  createFolder,
  downloadResources,
  uploadFileToId,
  renameResource,
  removeResources,
  signIn,
  signOut
};
