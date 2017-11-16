'use strict';

const path = require('path');

const getClientIp = require('../utils/get-client-ip');

const {
  encode: path2id,
  decode
} = require('../utils/id');

const {
  TYPE_FILE,
  TYPE_DIR
} = require('../constants');

const UNKNOWN_RESOURCE_TYPE_ERROR = 'Unknown resource type';

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

const stat2resource = (options, pathInfo) => stat => {
  let userPath, userBasename, userParent; // For root: userPath === path.sep, userBasename and userParent are falsy.

  if (typeof pathInfo === 'string') {
    userPath = pathInfo;

    if (userPath !== path.sep) {
      userBasename = path.basename(userPath);
      userParent = path.dirname(userPath);
    }
  } else {
    userParent = pathInfo.dir;
    userBasename = pathInfo.basename;
    userPath = userParent ? path.join(userParent, userBasename) : path.sep;
  }

  const id = path2id(userPath);

  const resource = {
    id,
    name: userBasename || options.rootName,
    createdTime: stat.birthtime,
    modifiedTime: stat.mtime,
    capabilities: {
      canListChildren: true,
      canAddChildren: true,
      canRemoveChildren: true,
      canDelete: !!userParent,
      canRename: !!userParent,
      canCopy: !!userParent,
      caEdit: stat.isFile(), // Only files can be edited
      canDownload: stat.isFile() // Only files can be downloaded
    }
  };

  if (userParent) {
    resource.parentId = path2id(userParent);
  }

  if (stat.isDirectory()) {
    resource.type = TYPE_DIR;
  } else if (stat.isFile()) {
    resource.type = TYPE_FILE;
    resource.size = stat.size;
  } else {
    throw new Error(UNKNOWN_RESOURCE_TYPE_ERROR);
  }

  return resource;
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
  checkName,
  id2path,
  path2id,
  stat2resource,
  handleError
}
