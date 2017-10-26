import request from 'superagent';
import id from '../../../../../../../server-nodejs/utils/id';

function normalizeResource(resource) {
  return {
    createDate: Date.parse(resource.createDate),
    id: resource.id,
    modifyDate: Date.parse(resource.modifyDate),
    title: resource.title,
    type: resource.type,
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
  pathToId,
  idToPath,
  getResourceById,
  getChildrenForId
};
