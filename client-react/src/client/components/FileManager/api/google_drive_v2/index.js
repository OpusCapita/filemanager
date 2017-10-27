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

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    console.log('Google Drive Login Success');
  } else {
    console.log('Google Drive Login Failed');
  }

  signedIn = isSignedIn;
}

// Initializes the API client library and sets up sign-in state listeners.
async function initClient({ API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES }) {
  await window.gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  });

  if (!window.gapi.auth2.getAuthInstance()) {
    console.log('Can\'t init Google API client');
    return;
  }

  // Listen for sign-in state changes.
  window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

  // Handle the initial sign-in state.
  updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
}

// On load, called to load the auth2 library and API client library.
async function handleClientLoad(options) {
  await window.gapi.load('client:auth2', () => initClient(options));
}

async function init(options) {
  console.log('opts', options);
  await appendGoogleApiScript().catch((error) => {
    console.error('Cant append Google API script tag', error);
  });

  console.log('Try auth on Google Drive API');
  await handleClientLoad(options);
}

function normalizeResource(resource) {
}

function pathToId(path) {
}

function idToPath(id) {
}

async function getResourceById(apiRoot, id) {
  return {};
  let route = `${apiRoot}/files/${id}`;
  let method = 'GET';
  let response = await request(method, route).catch((error) => {
    console.error(`Filemanager. getResourceById(${id})`, error);
  });

  let resource = response.body;
  return normalizeResource(resource);
}

async function getChildrenForId(apiRoot, id) {
  return [];
  let route = `${apiRoot}/files/${id}/children`;
  let method = 'GET';
  let response = await request(method, route).catch((error) => {
    console.error(`Filemanager. getChildrenForId(${id})`, error);
  });

  let resourceChildrenCount = response.body.length;
  let rawResourceChildren = response.body;
  let resourceChildren = rawResourceChildren.map((o) => normalizeResource(o));
  return { resourceChildren, resourceChildrenCount };
}

export default {
  init,
  pathToId,
  idToPath,
  getResourceById,
  getChildrenForId
};
