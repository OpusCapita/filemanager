import request from 'superagent';
import JSZip from 'jszip';
import { serializePromises } from './utils/common';
import getMessage from '../translations';

async function init(options) {
  options.onInitSuccess();
  options.onSignInSuccess();
}

function normalizeResource(resource) {
  if (resource) {
    return {
      capabilities: resource.capabilities,
      createdTime: Date.parse(resource.createdTime),
      id: resource.id,
      modifiedTime: Date.parse(resource.modifiedTime),
      name: resource.name,
      type: resource.type,
      size: resource.size,
      parentId: resource.parentId ? resource.parentId : null
    };
  } else {
    return {};
  }
}

async function getCapabilitiesForResource(options, resource) {
  return resource.capabilities || [];
}

async function getResourceById(options, id) {
  let route = `${options.apiRoot}/files/${id}`;
  let method = 'GET';
  let response = await request(method, route).catch((error) => {
    console.error(`Filemanager. getResourceById(${id})`, error);
  });

  let resource = response.body;

  return normalizeResource(resource);
}

async function getChildrenForId(options, { id, sortBy = 'name', sortDirection = 'ASC', onFail }) {
  let route = `${options.apiRoot}/files/${id}/children?orderBy=${sortBy}&orderDirection=${sortDirection}`;
  let method = 'GET';
  // FIXME EVERYWHERE: use "try {} catch () {}" with "await". It would fix the interception mentioned below.
  // https://hackernoon.com/6-reasons-why-javascripts-async-await-blows-promises-away-tutorial-c7ec10518dd9#8014
  let response = await request(method, route).catch((error) => {
    console.error(`Filemanager. getChildrenForId(${id})`, error);
    if (onFail) {
      onFail({ message: getMessage(options.locale, 'unableReadDir') }) // TODO doesn't intercept for some reason
    }
  });

  let rawResourceChildren = response.body.items;
  let resourceChildren = await Promise.all(rawResourceChildren.map(async (o) => normalizeResource(o)));
  return { resourceChildren }; // FIXME: no need to wrap into object because it gets unwrapped everywhere used.
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
  return await getParentsForId(options, resource.parentId, [parent].concat(result));
}

async function getBaseResource(options) {
  let route = `${options.apiRoot}/files`;
  let response = await request.get(route).catch((error) => {
    console.error('Filemanager. getBaseResource()', error);
  });
  return normalizeResource(response.body);
}

async function getRootId(options) {
  let resource = await getBaseResource(options);
  return resource.id;
}

async function getIdForPartPath(options, currId, pathArr) {
  let { resourceChildren } = await getChildrenForId(options, { id: currId });
  for (let i = 0; i < resourceChildren.length; i++) {
    let resource = resourceChildren[i];
    if (resource.name === pathArr[0]) {
      if (pathArr.length === 1) {
        return resource.id;
      } else {
        return await getIdForPartPath(options, resource.id, pathArr.slice(1));
      }
    }
  }

  return null;
}

async function getIdForPath(options, path) {
  let resource = await getBaseResource(options);

  let pathArr = path.split('/');

  if (pathArr.length === 0 || pathArr.length === 1 || pathArr[0] !== '') {
    return null;
  }

  if (pathArr.length === 2 && pathArr[1] === '') {
    return resource.id;
  }

  return await getIdForPartPath(options, resource.id, pathArr.slice(1));
}

async function getParentIdForResource(options, resource) {
  return resource.parentId;
}

async function readLocalFile() {
  return new Promise((resolve, reject) => {
    let uploadInput = document.createElement("input");
    let reader = new FileReader();

    uploadInput.addEventListener('change', (e) => {
      let file = uploadInput.files[0];
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

async function uploadFileToId(options, parentId, { onStart, onSuccess, onFail, onProgress }) {
  let file = await readLocalFile(true);
  let route = `${options.apiRoot}/files`;
  onStart({ name: file.name, size: file.file.size });
  request.post(route).
  field('type', 'file').
  field('parentId', parentId).
  attach('files', file.file, file.name).
  on('progress', event => {
    onProgress(event.percent);
  }).
  end((error, response) => {
    if (error) {
      console.log(`Filemanager. uploadFileToId(${parentId})`, error);
      onFail();
    } else {
      let newResource = normalizeResource(response.body[0]);
      onSuccess(newResource.id);
    }
  });
}

async function downloadResource({ apiOptions, resource, onProgress, i, l, onFail }) {
  const downloadUrl = `${apiOptions.apiRoot}/download?items=${resource.id}`;

  return request.get(downloadUrl).
    responseType('blob').
    on('progress', event => {
      onProgress((i * 100 + event.percent) / l);
    }).
    then(
      res => ({
        file: res.body,
        name: resource.name
      }),
      err => {
        console.error(err);
        onFail();
      }
  );
}

async function downloadResources({ apiOptions, resources, trackers: {
  onStart,
  onSuccess,
  onFail,
  onProgress
} }) {
  if (resources.length === 1) {
    const { id, name } = resources[0];
    return {
      direct: true, // FIXME: "direct" object property is never used.
      downloadUrl: `${apiOptions.apiRoot}/download?items=${id}`,
      name
    }
  }

  // multiple resources -> download one by one

  const archiveName = apiOptions.archiveName || 'archive.zip';

  onStart({ archiveName, quantity: resources.length });

  const files = await serializePromises({
    series: resources.map(resource => ({ onProgress, i, l, onFail }) => downloadResource({
      resource, apiOptions, onProgress, i, l, onFail
    })),
    onProgress,
    onFail
  });

  onProgress(100);

  const zip = new JSZip();
  files.forEach(({ name, file }) => zip.file(name, file));
  const blob = await zip.generateAsync({ type: 'blob' });

  setTimeout(onSuccess, 1000);

  return {
    direct: false, // FIXME: "direct" object property is never used.
    file: blob,
    name: archiveName
  }
}

async function createFolder(options, parentId, folderName, { onFail }) {
  let route = `${options.apiRoot}/files`;
  let method = 'POST';
  let params = {
    parentId,
    name: folderName,
    type: 'dir'
  };
  let response = await request(method, route).send(params).
  catch((error) => {
    console.error(`Filemanager. createFolder(${id})`, error);
    onFail()
  });
  return response;
}

function getResourceName(apiOptions, resource) {
  return resource.name;
}

async function renameResource(options, id, newName, { onFail }) {
  let route = `${options.apiRoot}/files/${id}`;
  let method = 'PATCH';
  let response = await request(method, route).type('application/json').send({ name: newName }).
  catch((error) => {
    console.error(`Filemanager. renameResource(${id})`, error);
    onFail()
  });
  return response;
}

async function removeResource(options, resource) {
  let route = `${options.apiRoot}/files/${resource.id}`;
  let method = 'DELETE';
  let response = await request(method, route).
  catch((error) => {
    throw error;
  });
  return response;
}

async function removeResources(options, selectedResources, { onSuccess, onFail }) { // FIXME: tight coupling with onSuccess/onFail. Just return a promise.
  let success = await Promise.all(selectedResources.map(async (resource) => await removeResource(options, resource))).
  catch((error) => {
    console.error(`Filemanager. removeResources`, error);
    onFail();
  });
  onSuccess();
}

export default {
  init,
  getIdForPath,
  getResourceById,
  getCapabilitiesForResource,
  getChildrenForId,
  getRootId,
  getParentsForId,
  getParentIdForResource,
  getResourceName,
  createFolder,
  downloadResources,
  renameResource,
  removeResources,
  uploadFileToId
};
