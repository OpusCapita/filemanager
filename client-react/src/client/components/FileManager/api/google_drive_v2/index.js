import request from 'superagent';
import id from '../../../../../../../server-nodejs/utils/id';

function appendGoogleApiScript() {
  if (gapi) {
    return false;
  };

  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://apis.google.com/js/api.js';
    document.body.appendChild(script);
    script.addEventListener('load', resolve);
    script.addEventListener('error', reject);
  });
}

// On load, called to load the auth2 library and API client library.
function handleClientLoad(options) {
  return new Promise((resolve, reject) => {
    gapi.load('client:auth2', () => initClient(options).then(resolve).catch(reject));
  });
}

// Initializes the API client library and sets up sign-in state listeners.
function initClient({ API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES }) {
  return new Promise((resolve, reject) => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(function () {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(resolve);

      // Handle the initial sign-in state.
      resolve(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
  });
}

async function init(options) {
  appendGoogleApiScript().
    then(() => {
      console.log('Try auth on Google Drive API');
      handleClientLoad(options);
    }).
    catch((error) => {
      console.error(error);
    });
}

function normalizeResource(resource) {
}

function pathToId(path) {
}

function idToPath(id) {
}

async function getResourceById(apiRoot, id) {
  let route = `${apiRoot}/files/${id}`;
  let method = 'GET';
  let response = await request(method, route).catch((error) => {
    console.error(`Filemanager. getResourceById(${id})`, error);
  });

  let resource = response.body;
  return normalizeResource(resource);
}

async function getChildrenForId(apiRoot, id) {
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
