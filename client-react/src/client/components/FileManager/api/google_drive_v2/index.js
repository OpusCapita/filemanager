import request from 'superagent';
import id from '../../../../../../../server-nodejs/utils/id';

let signedIn = false;

function appendGoogleApiScript() {
  if (window.gapi) {
    return false;
  };

  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://apis.google.com/js/api.js';
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

function updateSigninStatus(isSignedIn, options) {
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

  if (!window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
    window.gapi.auth2.getAuthInstance().signIn();
  }

  // Handle the initial sign-in state.
  updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get(), options);
}

// On load, called to load the auth2 library and API client library.
async function handleClientLoad(options) {
  await window.gapi.load('client:auth2', () => initClient(options));
}

async function init(options) {
  await appendGoogleApiScript().catch((error) => {
    console.error('Cant append Google API script tag', error);
  });

  console.log('Try auth on Google Drive API');
  await handleClientLoad(options);
}

function normalizeResource(resource) {
  if (resource === null) {
    return {
      createDate: '',
      id: 'googleDriveRoot',
      modifyDate: '',
      title: 'Root',
      type: 'dir',
      size: 0,
      parentId: ''
    };
  }

  // console.log('res', resource);
  let type = '';
  if (resource.mimeType === 'application/vnd.google-apps.folder') {
    type = 'dir';
  } else {
    type = 'file';
  }

  return {
    createDate: Date.parse(resource.createdDate),
    id: resource.id,
    modifyDate: Date.parse(resource.modifiedDate),
    title: resource.title,
    type: type,
    size: typeof resource.fileSize === 'undefined' ? resource.fileSize : parseInt(resource.fileSize),
    parentId: resource.parentId
  };
}

function pathToId(path) {
}

function idToPath(id) {
}

async function getResourceById(options, id) {
  if (id === '') {
    return normalizeResource(null);
  }

  let response =  await window.gapi.client.drive.files.get({
    fileId: id,
    // maxResults: 1
  });
  console.log(response);
  return {};
  // let resource = response.body;
  // return normalizeResource(resource);
}

async function getChildrenForId(options, id) {
  if (id === 'googleDriveRoot') {
    let response =  await window.gapi.client.drive.files.list({ q: `'root' in parents` });
    let resourceChildren = response.result.items.map((o) => normalizeResource({ ...o, parentId: id }));
    return { resourceChildren };
  }
}

function signIn() {
  window.gapi.auth2.getAuthInstance().signIn();
}

function signOut() {
  window.gapi.auth2.getAuthInstance().signOut();
}


export default {
  init,
  pathToId,
  idToPath,
  getResourceById,
  getChildrenForId,
  signIn,
  signOut
};
