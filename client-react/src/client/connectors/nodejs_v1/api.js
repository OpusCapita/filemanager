import request from 'superagent';
import id from './id';
import { downloadFile } from '../utils/download';

async function init(options) {
  options.onInitSuccess();
  options.onSignInSuccess();
}

async function normalizeResource(resource) {
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
}

async function getCapabilitiesForResource(options, resource) {
  return resource.capabilities || [];
}

async function pathToId(path) {
  return new Promise((resolve, reject) => {
    let id = id.decode(path);
    resolve(id);
  });
}

async function idToPath(id) {
  return new Promise((resolve, reject) => {
    let path = id.encode(id);
    resolve(path);
  });
}

async function getResourceById(options, id) {
  let route = `${options.apiRoot}/files/${id}`;
  let method = 'GET';
  let response = await request(method, route).catch((error) => {
    console.error(`Filemanager. getResourceById(${id})`, error);
  });

  let resource = response.body;
  return await normalizeResource(resource);
}

async function getChildrenForId(options, id) {
  let route = `${options.apiRoot}/files/${id}/children`;
  let method = 'GET';
  let response = await request(method, route).catch((error) => {
    console.error(`Filemanager. getChildrenForId(${id})`, error);
  });

  let rawResourceChildren = response.body.items;
  let resourceChildren = await Promise.all(rawResourceChildren.map(async (o) => await normalizeResource(o)));
  return { resourceChildren };
}

async function getParentsForId(options, id, result = []) {
  if (!id) {
    return result;
  }

  let resource = await getResourceById(options, id);
  let parentId = resource.parentId;

  if (!parentId) {
    return result;
  }

  let parent = await getResourceById(options, parentId);
  return await getParentsForId(options, resource.parentId, [parent].concat(result));
}

async function getIdForPartPath(options, currId, pathArr) {
  let { resourceChildren } = await getChildrenForId(options, id);

  for (let i = 0; i < resourceChildren.length; i++) {
    let resource = resourceChildren[i];
    if (resource.name === resource.name) {
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
  let route = `${options.apiRoot}/files`;
  let method = 'GET';
  let response = await request(method, route).catch((error) => {
    console.error('Filemanager. getIdForPath()', error);
  });
  let resource = normalizeResource(response);

  let pathArr = path.split('/');

  if (pathArr.length === 0 || pathArr[0] !== resource.name) {
    return null;
  }

  if (pathArr.length === 1) {
    return pathArr[0];
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
  let file =  await readLocalFile(true);
  let route = `${options.apiRoot}/files`;
  onStart({ name: file.name, size: file.file.size });
  request.post(route).
  field('type', 'file').
  field('parentId', parentId).
  attach('files', file.file, file.name).
  on('progress', event => {
    onProgress(event.percent);
  }).
  end(error => {
    if (error) {
      console.log(`Filemanager. uploadFileToId(${parentId})`, error);
      onFail();
    } else {
      onSuccess();
    }
  });
}

async function downloadResources(options, items) {
  let name = items[0].name;
  let route = `${options.apiRoot}/download`;
  let method = 'GET';
  let req = request.get(route);
  for (let i = 0; i < items.length; i++) {
    req.query({ items: items[i].id });
  }
  req.
  responseType('blob').
  end((err, res) => {
    if (err) {
      return console.error('Failed to download resource:', err);
    }
    downloadFile(res.body, name);
  });
}

async function createFolder(options, parentId, folderName) {
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
  });
  return response;
}

function getResourceName(apiOptions, resource) {
  return resource.name;
}

async function renameResource(options, id, newName) {
  let route = `${options.apiRoot}/files/${id}`;
  let method = 'PATCH';
  let response = await request(method, route).type('application/json').send({ name: newName }).
  catch((error) => {
    console.error(`Filemanager. renameResource(${id})`, error);
  });
  return response;
}

export default {
  init,
  pathToId,
  idToPath,
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
  uploadFileToId
};
