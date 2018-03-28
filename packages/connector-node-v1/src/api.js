import request from 'superagent';
import JSZip from 'jszip';
import { serializePromises, normalizeResource } from './utils/common';

async function init(options) {
  return {
    isInit: true,
    isSignIn: true
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

async function readLocalFile() {
  return new Promise((resolve, reject) => {
    const uploadInput = document.createElement("input");

    uploadInput.addEventListener('change', _ => {
      const file = uploadInput.files[0];
      resolve({
        type: file.type,
        name: file.name,
        file
      });
    });

    uploadInput.type = "file";
    document.body.appendChild(uploadInput);
    uploadInput.click();
    document.body.removeChild(uploadInput);
  });
}

async function uploadFileToId(options, parentId, { onStart, onProgress }) {
  let file = await readLocalFile(true);
  let route = `${options.apiRoot}/files`;
  onStart({ name: file.name, size: file.file.size });
  return request.post(route).
    field('type', 'file').
    field('parentId', parentId).
    attach('files', file.file, file.name).
    on('progress', event => {
      onProgress(event.percent);
    });
}

async function downloadResource({ apiOptions, resource, onProgress, i, l }) {
  const downloadUrl = `${apiOptions.apiRoot}/download?items=${resource.id}`;
  return request.get(downloadUrl).
    responseType('blob').
    on('progress', event => {
      onProgress((i * 100 + event.percent) / l);
    }).
    then(res => ({
      file: res.body,
      name: resource.name
    }));
}

async function downloadResources({ apiOptions, resources, onProgress }) {
  const files = await serializePromises({
    series: resources.map(resource => ({ onProgress, i, l }) => downloadResource({
      resource, apiOptions, onProgress, i, l
    })),
    onProgress
  });

  onProgress(100);

  const zip = new JSZip();
  files.forEach(({ name, file }) => zip.file(name, file));
  return zip.generateAsync({ type: 'blob' });
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

export default {
  init,
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
  uploadFileToId
};
