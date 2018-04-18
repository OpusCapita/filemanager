import request from 'superagent';
import { normalizeResource } from './utils/common';

const NEXT_PAGE_REQUEST_DELAY = 2000; // Delayed request for next page.

function sleep(ms) {
  let abort;

  return {
    promise: new Promise((resolve, reject) => {
      const timeoutId = setTimeout(resolve, ms);

      abort = _ => {
        clearTimeout(timeoutId);
        reject();
      }
    }),
    abort
  };
}

/**
 * hasSignedIn
 *
 * @returns {boolean}
 */
function hasSignedIn() {
  return true;
}

/**
 * Init API
 *
 * @returns {Promise<{apiInitialized: boolean, apiSignedIn: boolean}>}
 */
function init() {
  return {
    apiInitialized: true,
    apiSignedIn: true
  };
}

async function getCapabilitiesForResource(options, resource) {
  return resource.capabilities || [];
}

async function getResourceById(options, id) {
  const route = `${options.apiRoot}/files/${id}`;
  const method = 'GET';
  const response = await request(method, route);
  return normalizeResource(response.body);
}

async function getChildrenForId(options, { id, sortBy = 'name', sortDirection = 'ASC' }) {
  const route = `${options.apiRoot}/files/${id}/children?orderBy=${sortBy}&orderDirection=${sortDirection}`;
  const method = 'GET';
  const response = await request(method, route);
  return response.body.items.map(normalizeResource)
}

async function getParentsForId(options, id, result = []) {
  if (!id) {
    return result;
  }

  let resource = await getResourceById(options, id);

  if (!resource) {
    return result;
  }

  let parentId = resource.parentId;

  if (!parentId) {
    return result;
  }

  let parent = await getResourceById(options, parentId);
  return getParentsForId(options, resource.parentId, [parent, ...result]);
}

async function getBaseResource(options) {
  const route = `${options.apiRoot}/files`;
  const response = await request.get(route);
  return normalizeResource(response.body);
}

async function getIdForPartPath(options, currId, pathArr) {
  const resourceChildren = await getChildrenForId(options, { id: currId });
  for (let i = 0; i < resourceChildren.length; i++) {
    const resource = resourceChildren[i];
    if (resource.name === pathArr[0]) {
      if (pathArr.length === 1) {
        return resource.id;
      } else {
        return getIdForPartPath(options, resource.id, pathArr.slice(1));
      }
    }
  }

  return null;
}

async function getIdForPath(options, path) {
  const resource = await getBaseResource(options);
  const pathArr = path.split('/');

  if (pathArr.length === 0 || pathArr.length === 1 || pathArr[0] !== '') {
    return null;
  }

  if (pathArr.length === 2 && pathArr[1] === '') {
    return resource.id;
  }

  return getIdForPartPath(options, resource.id, pathArr.slice(1));
}

async function getParentIdForResource(options, resource) {
  return resource.parentId;
}

async function uploadFileToId({ apiOptions, parentId, file, onProgress }) {
  let route = `${apiOptions.apiRoot}/files`;
  return request.post(route).
    field('type', 'file').
    field('parentId', parentId).
    attach('files', file.file, file.name).
    on('progress', event => {
      onProgress(event.percent);
    });
}

async function downloadResources({ apiOptions, resources, onProgress }) {
  const downloadUrl = resources.reduce(
    (url, resource, num) => url + (num === 0 ? '' : '&') + `items=${resource.id}`,
    `${apiOptions.apiRoot}/download?`
  );

  let res = await request.get(downloadUrl).
    responseType('blob').
    on('progress', event => {
      onProgress(event.percent);
    });

  return res.body;
}

async function createFolder(options, parentId, folderName) {
  const route = `${options.apiRoot}/files`;
  const method = 'POST';
  const params = {
    parentId,
    name: folderName,
    type: 'dir'
  };
  return request(method, route).send(params)
}

function getResourceName(apiOptions, resource) {
  return resource.name;
}

async function renameResource(options, id, newName) {
  const route = `${options.apiRoot}/files/${id}`;
  const method = 'PATCH';
  return request(method, route).type('application/json').send({ name: newName })
}

async function removeResource(options, resource) {
  const route = `${options.apiRoot}/files/${resource.id}`;
  const method = 'DELETE';
  return request(method, route)
}

async function removeResources(options, selectedResources) {
  return Promise.all(selectedResources.map(resource => removeResource(options, resource)))
}

const searchForResources = ({
  options, // mandatory.
  resourceId, // mandatory.
  itemNameSubstring, // optional, no default value.
  itemNameCaseSensitive = false,
  isFile = false,
  isDir = false,
  recursive = false,
  onProgress = _ => {}
}) => {
  let abort = _ => {};
  const abortErr = { aborted: true };
  const urlOrigin = `${options.apiRoot}/files/${resourceId}/search`;

  const _searchForResources = async resourcesPromise => {
    let aborted;

    abort = _ => {
      aborted = true;
    }

    let { body: { items: resources, nextPage } } = await resourcesPromise;

    if (aborted) {
      throw abortErr;
    }

    abort = _ => {}; // In case it is called in onProgress() below or function exits without nextPage.
    resources = resources.map(normalizeResource);

    if (!nextPage) {
      return resources;
    }

    onProgress(resources);

    const {
      promise: sleepPromise,
      abort: abortSleep
    } = sleep(NEXT_PAGE_REQUEST_DELAY);

    abort = abortSleep;

    try {
      await sleepPromise;
    } catch (err) {
      throw abortErr;
    }

    return _searchForResources(request.get(`${urlOrigin}?${nextPage}`));
  }

  return {
    promise: _searchForResources(request.
      get(urlOrigin).
      query({
        itemNameCaseSensitive,
        recursive,
        ...(itemNameSubstring && { itemNameSubstring }),
        itemType: [
          ...(isFile && ['file']),
          ...(isDir && ['dir'])
        ]
      })
    ),

    // Dynamically substituting with up-to-date abort() function,
    // as it changes during api call lifecycle:
    abort: _ => abort()
  };
}

export default {
  init,
  hasSignedIn,
  getIdForPath,
  getResourceById,
  getCapabilitiesForResource,
  getChildrenForId,
  getParentsForId,
  getParentIdForResource,
  getResourceName,
  createFolder,
  downloadResources,
  renameResource,
  removeResources,
  uploadFileToId,
  searchForResources
};
