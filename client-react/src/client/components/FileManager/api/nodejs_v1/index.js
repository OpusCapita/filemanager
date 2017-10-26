import request from 'superagent';
import id from '../../../../../../../server-nodejs/utils/id';

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
  let { body } = response;

  return {
    createDate: body.createDate,
    id: body.id,
    modifyDate: body.modifyDate,
    title: body.title,
    type: body.type,
    parentId: body.parentId
  };
}

async function getItemsForId(apiRoot, id) {
  let route = `${apiRoot}/files/${id}/children`;
  let method = 'GET';
  let response = await request(method, route).catch((error) => {
    console.error(`Filemanager. getItemsForId(${id})`, error);
  });

  let { body } = response;
  return {
    resourceItems: body,
    resourceItemsCount: body.length
  };
}

export default {
  pathToId,
  idToPath,
  getResourceById,
  getItemsForId
};
