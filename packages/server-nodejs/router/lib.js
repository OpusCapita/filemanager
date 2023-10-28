'use strict';

const path = require('path');
const fs = require('fs-extra');
const { platform } = require('os');
const { promisify } = require('util');
const _isBinaryFile = promisify(require('isbinaryfile'));
const textExtensions = require('textextensions').concat('gsp');
const binaryExtensions = require('binaryextensions');

const getClientIp = require('../utils/get-client-ip');

const {
  encode: path2id,
  decode
} = require('../utils/id');

const {
  TYPE_FILE,
  TYPE_DIR,
  TYPE_BROKEN_LINK,
  TYPE_ENCODING_NAME_ERROR
} = require('../constants');

const
  UNKNOWN_RESOURCE_TYPE_ERROR = 'Unknown resource type',

  ORDER_BY_NAME = 'name',
  ORDER_BY_MODIFIED_TIME = 'modifiedTime',
  DEFAULT_ORDER_BY = ORDER_BY_NAME,

  ORDER_DIRECTION_ASC = 'ASC',
  ORDER_DIRECTION_DESC = 'DESC',
  DEFAULT_ORDER_DIRECTION = ORDER_DIRECTION_ASC;

let fsCaseSensitive;

switch (platform()) {
  case 'win32':
    fsCaseSensitive = false;
    break;
  case 'darwin': // Mac OS
    // TODO
    fsCaseSensitive = true;
    break;
  default: // Linux and others.
    fsCaseSensitive = true;
    break;
}

const getBasenameSorter = caseSensitive => (basenameA, basenameB) => basenameA.localeCompare(basenameB, {
  sensitivity: caseSensitive && fsCaseSensitive ? 'variant' : 'accent'
});

/**
 * Default sorting order:
 * 1. Dirs sorted by basename, taking into consideration whether the platform is case-sensitive.
 * 2. Files sorted by basename, taking into consideration whether the platform is case-sensitive.
 */
const getSorter = ({
  orderBy = DEFAULT_ORDER_BY,
  orderDirection = DEFAULT_ORDER_DIRECTION,
  caseSensitive = true
}) => {
  let sameTypeSorter;

  switch (orderBy) {
    case ORDER_BY_NAME:
      const basenameSorter = getBasenameSorter(caseSensitive);
      sameTypeSorter = (itemA, itemB) => basenameSorter(itemA.name, itemB.name);
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
const getResource = async ({
  config,
  session,
  path: userPath, // path relative to config.fsRoot, path.sep for user root. Optional.
  parent: userParent, // path relative to config.fsRoot, null for user root. Optional.
  basename: userBasename, // null for user root. Optional.
  stats // fs.Stats object returned by fs.stat() call. Optional.
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

  let parent;

  ([stats, parent] = await Promise.all([ // eslint-disable-line no-param-reassign,prefer-const
    stats || fs.stat(path.join(config.fsRoot, userPath)).catch(() => {return fs.lstat(path.join(config.fsRoot, userPath)).catch(() => {return false;})}),
    userParent && getResource({
      config,
      session,
      path: userParent
    })
  ]));

  const resource = {
    id: path2id(userPath),
    name: userBasename || config.rootName,
    createdTime: stats.birthtime,
    modifiedTime: stats.mtime,
    capabilities: {
      canDelete: !!userParent && !isReadOnly(config, session),
      canRename: !!userParent && !isReadOnly(config, session),
      canCopy: !!userParent && !isReadOnly(config, session),
      canEdit: stats && stats.isFile() && !isReadOnly(config, session), // Only files can be edited
      canDownload: stats && stats.isFile() // Only files can be downloaded
    }
  };

  if (stats === false) {
    resource.type = TYPE_ENCODING_NAME_ERROR;
  } else if (stats.isDirectory()) {
    resource.type = TYPE_DIR;
    resource.capabilities.canListChildren = true;
    resource.capabilities.canAddChildren = !isReadOnly(config, session);
    resource.capabilities.canRemoveChildren = !isReadOnly(config, session);
  } else if (stats.isFile()) {
    resource.type = TYPE_FILE;
    resource.size = stats.size;
  } else if (stats.isSymbolicLink()) {
    resource.type = TYPE_BROKEN_LINK;
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
};

const handleError = ({ config, req, res }) => err => {
  config.logger.error(`Error processing request by ${getClientIp(req)}: ${err}` + '\n' +
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

/*
 * @param {string} filePath - File full path (either process-relative or absolute).
 * @returns {Promise} - A promise of boolean, whether the file content is binary (vs. text).
 */
const isBinaryFile = async filePath => {
  const ext = path.extname(filePath).slice(1);

  if (ext) {
    if (textExtensions.includes(ext)) { return false; }
    if (binaryExtensions.includes(ext)) { return true; }
  }

  return _isBinaryFile(filePath);
}

const isReadOnly = (config, session) => {
  return config.users ? (session.user ? session.user.readOnly : config.readOnly) : config.readOnly;
}

module.exports = {
  UNKNOWN_RESOURCE_TYPE_ERROR,
  getSorter,
  checkName,
  id2path,
  path2id,
  getResource,
  handleError,
  isBinaryFile,
  fsCaseSensitive,
  isReadOnly
}
