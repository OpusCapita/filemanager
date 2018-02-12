'use strict';

const path = require('path');
const fs = require('fs-extra');

const getClientIp = require('../utils/get-client-ip');

const {
  encode: path2id,
  decode
} = require('../utils/id');

const {
  TYPE_FILE,
  TYPE_DIR
} = require('../constants');

const
  UNKNOWN_RESOURCE_TYPE_ERROR = 'Unknown resource type',

  ORDER_BY_NAME = 'name',
  ORDER_BY_MODIFIED_TIME = 'modifiedTime',
  DEFAULT_ORDER_BY = ORDER_BY_NAME,

  ORDER_DIRECTION_ASC = 'ASC',
  ORDER_DIRECTION_DESC = 'DESC',
  DEFAULT_ORDER_DIRECTION = ORDER_DIRECTION_ASC;

const getSorter = ({
  orderBy = DEFAULT_ORDER_BY,
  orderDirection = DEFAULT_ORDER_DIRECTION
}) => {
  let sameTypeSorter;

  switch (orderBy) {
    case ORDER_BY_NAME:
      sameTypeSorter = (itemA, itemB) => itemA.name.toLowerCase().localeCompare(itemB.name.toLowerCase());
      break;
    case ORDER_BY_MODIFIED_TIME:
      sameTypeSorter = (itemA, itemB) => itemA.modifiedTime - itemB.modifiedTime;
      break;
    default:
      throw Object.assign(
        new Error(`Invalid order by: ${orderBy}`),
        { httpCode: 400 }
      );
  }

  let swapArgs;

  switch (orderDirection) {
    case ORDER_DIRECTION_ASC:
      swapArgs = false;
      break;
    case ORDER_DIRECTION_DESC:
      swapArgs = true;
      break;
    default:
      throw Object.assign(
        new Error(`Invalid order direction: ${orderDirection}`),
        { httpCode: 400 }
      );
  }

  return (itemA, itemB) => (itemB.type === TYPE_DIR) - (itemA.type === TYPE_DIR) || sameTypeSorter(...(
    swapArgs ?
      [itemB, itemA] :
      [itemA, itemB]
  ));
};


const id2path = id => {
  const userPath = decode(id);

  if (!userPath || typeof userPath !== 'string') {
    throw new Error('Invalid path, it must be non-empty string');
  }

  if (userPath.charAt(0) !== path.sep) {
    throw new Error(`Invalid path, it must start with "${path.sep}"`);
  }

  if (userPath !== path.sep && userPath.slice(-1) === path.sep) {
    throw new Error(`Invalid path, it must not end with "${path.sep}"`);
  }

  if (userPath.includes(path.sep + path.sep)) {
    throw new Error(`Invalid path, it must not contain two "${path.sep}" in a row`);
  }

  return userPath;
};

const checkName = name => {
  if (!name) {
    throw new Error('Name must not be empty');
  }

  if (typeof name !== 'string') {
    throw new Error('Name must be a string');
  }

  if (name.includes(path.sep)) {
    throw new Error('Unable to create name with forbidden symbols');
  }

  return name;
};

/*
 * Either path or parent/basename must be specified in input args.
 * The function returns a promise.
 */
const getResource = ({
  options,
  path: userPath, // path relative to options.fsRoot, path.sep for user root. Optional.
  parent: userParent, // path relative to options.fsRoot, null for user root. Optional.
  basename: userBasename, // null for user root. Optional.
  stat // a result of fs.stat() call. Optional.
}) => {
  /* eslint-disable no-param-reassign */
  if (userPath) {
    if (userPath === path.sep) {
      userBasename = null;
      userParent = null;
    } else {
      userBasename = path.basename(userPath);
      userParent = path.dirname(userPath);
    }
  } else if (userBasename && userParent) {
    userPath = path.join(userParent, userBasename);
  } else if (!userBasename && !userParent) {
    userPath = path.sep;
  } else {
    throw new Error(`Invalid parent ${userParent} and basename ${userBasename}`);
  }
  /* eslint-enable no-param-reassign */

  return Promise.all([
    stat || fs.stat(path.join(options.fsRoot, userPath)),
    userParent && getResource({
      options,
      path: userParent
    })
  ]).
    then(([stat, parent]) => {
      const resource = {
        // path: userPath + (stat.isDirectory() ? '/' : ''),
        id: path2id(userPath),
        name: userBasename || options.rootName,
        createdTime: stat.birthtime,
        modifiedTime: stat.mtime,
        capabilities: {
          canListChildren: true,
          canAddChildren: !options.readOnly,
          canRemoveChildren: !options.readOnly,
          canDelete: !!userParent && !options.readOnly,
          canRename: !!userParent && !options.readOnly,
          canCopy: !!userParent && !options.readOnly,
          canEdit: stat.isFile() && !options.readOnly, // Only files can be edited
          canDownload: stat.isFile() // Only files can be downloaded
        }
      };

      if (stat.isDirectory()) {
        resource.type = TYPE_DIR;
      } else if (stat.isFile()) {
        resource.type = TYPE_FILE;
        resource.size = stat.size;
      } else {
        throw new Error(UNKNOWN_RESOURCE_TYPE_ERROR);
      }

      if (parent) {
        resource.parentId = parent.id;
        resource.ancestors = [...parent.ancestors, parent];
      } else {
        resource.ancestors = [];
      }

      return resource;
    });
};

const handleError = ({ options, req, res }) => err => {
  options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}` + '\n' +
    (err.stack && err.stack.split('\n'))
  );

  if (err.httpCode) {
    res.status(err.httpCode).end();
    return;
  }

  switch (err.code) {
    case 'ENOENT':
    case 'ENOTDIR':
    case 'EISDIR':
      res.status(410).end();
      break;
    case 'EACCES':
    case 'EPERM':
      res.status(403).end();
      break;
    default:
      res.status(500).end();
  }
};

module.exports = {
  UNKNOWN_RESOURCE_TYPE_ERROR,
  getSorter,
  checkName,
  id2path,
  path2id,
  getResource,
  handleError
}
