import request from 'superagent';
import JSZip from 'jszip';
import id from './id';
import { serializePromises } from '../utils/common';

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
    // ancestors: resource.ancestors,
    parentId: resource.parentId ? resource.parentId : null
    // parentId: resource.ancestors ? resource.ancestors[resource.ancestors.length - 1] : null
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

async function downloadResource({ apiOptions, resource }) {
  const downloadUrl = `${apiOptions.apiRoot}/download?items=${resource.id}`
  return request.get(downloadUrl).
    responseType('blob').
    then(
      res => ({
        file: res.body,
        name: resource.name
      }),
      err => { throw new Error(`Failed to download resource: ${err}`) }
  );
}

async function downloadResources({ apiOptions, resources }) {
  if (resources.length === 1) {
    const { id, name } = resources[0];
    return {
      direct: true,
      downloadUrl: `${apiOptions.apiRoot}/download?items=${id}`,
      name
    }
  }

  // multiple resources -> download one by one
  const files = await serializePromises(resources.map(
    resource => _ => downloadResource({ resource, apiOptions })
  ))

  const zip = new JSZip();
  // add generated files to a zip bundle
  files.forEach(({ name, file }) => zip.file(name, file));

  const blob = await zip.generateAsync({ type: 'blob' })

  return {
    direct: false,
    file: blob,
    name: apiOptions.archiveName || 'archive.zip'
  }
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
    console.error(`Filemanager. renameResource(${id})`, error);
  });
  return response;
}

function getResourceName(apiOptions, resource) {
  return resource.name;
}

async function renameResource(options, id, newName) {
  let route = `${options.apiRoot}/files/${id}`;
  let method = 'PATCH';
  let response = await request(method, route).send({ name: newName }).
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
  renameResource
};
