import request from 'superagent';
import id from '../../../../../server-nodejs/utils/id';

async function init(options) {
  options.onInitSuccess();
  options.onSignInSuccess();
}

function normalizeResource(resource) {
  return {
    createDate: Date.parse(resource.createDate),
    id: resource.id,
    modifyDate: Date.parse(resource.modifyDate),
    title: resource.title,
    type: resource.type,
    size: resource.size,
    parentId: resource.parentId
  };
}

function pathToId(path) {
  return new Promise((resolve, reject) => {
    let id = id.decode(path);
    resolve(id);
  });
}

function idToPath(id) {
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
  return normalizeResource(resource);
}

async function getChildrenForId(options, id) {
  let route = `${options.apiRoot}/files/${id}/children`;
  let method = 'GET';
  let response = await request(method, route).catch((error) => {
    console.error(`Filemanager. getChildrenForId(${id})`, error);
  });

  let rawResourceChildren = response.body.items;
  let resourceChildren = rawResourceChildren.map((o) => normalizeResource(o));
  return { resourceChildren };
}

async function getParentsForId(options, id, result = []) {
  let resource = await getResourceById(options, id);

  console.log('res', resource);

  if (!resource.ancestors) {
    return result;
  }
  // let response = await window.gapi.client.drive.parents.list({
  //   fileId: id,
  //   fields: 'items(id)'
  // });
  // let parentId = typeof response.result.items[0] === 'undefined' ? 'root' : response.result.items[0].id;

  // if (parentId === 'root') {
  //   return result;
  // }

  // let parent = await getResourceById(options, parentId);

  // return await getParentsForId(options, parentId, [parent].concat(result));
}

export default {
  init,
  pathToId,
  idToPath,
  getResourceById,
  getChildrenForId,
  getParentsForId
};
