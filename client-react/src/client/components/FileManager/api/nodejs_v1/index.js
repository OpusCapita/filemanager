import id from '../../../../../../../server-nodejs/utils/id';
import request from 'superagent';

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
  let route = apiRoot;
  let method = 'GET';
  let response = await request(method, route);

  return response;
}

export default {
  pathToId,
  idToPath
};
