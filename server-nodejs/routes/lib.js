'use strict';

const path = require('path');

const {
  encode: path2id,
  decode
} = require('../utils/id');

const {
  TYPE_FILE,
  TYPE_DIR
} = require('../../shared/constants');

const UNKNOWN_RESOURCE_TYPE_ERROR = 'Unknown resource type';

const id2path = id => {
  const userPath = decode(id);

  if (!userPath || typeof userPath !== 'string') {
    throw new Error('Invalid path, it must be non-empty string');
  }

  if (userPath.charAt(0) !== '/') {
    throw new Error('Invalid path, it must start with "/"');
  }

  if (/.\/$/.test(userPath)) {
    throw new Error('Invalid path, it must not end with "/"');
  }

  if (~userPath.indexOf('\\')) {
    throw new Error('Invalid path, it must not contain "\\"');
  }

  if (~userPath.indexOf('//')) {
    throw new Error('Invalid path, it must not contain two "/" in a row');
  }

  return userPath;
};

const checkTitle = title => {
  if (!title) {
    throw new Error('Title must not be empty');
  }

  if (typeof title !== 'string') {
    throw new Error('Title must be a string');
  }

  if (~title.indexOf(path.sep) || ~title.indexOf('/')) {
    throw new Error('Unable to create title with forbidden symbols');
  }

  return title;
};

const stat2resource = (options, pathInfo) => stat => {
  let userPath, userParent, userBasename; // For root, userPath === '/', userParent and userBasename are falsy.

  if (typeof pathInfo === 'string') {
    userPath = pathInfo;

    if (userPath !== '/') {
      userParent = path.dirname(userPath);
      userBasename = path.basename(userPath);
    }
  } else {
    userParent = pathInfo.dir;
    userBasename = pathInfo.basename;
    userPath = userParent ?
      (userParent === '/' ? '/' : userParent + '/') + userBasename :
      '/';
  }

  const id = path2id(userPath);

  const resource = {
    id,
    title: userBasename || options.rootTitle,
    createDate: stat.birthtime,
    modifyDate: stat.mtime,
    capabilities: {
      canListChildren: true,
      canAddChildren: true,
      canRemoveChildren: true,
      canDelete: !!userParent,
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
    // TBD: in "downloadUrl" Google includes protocol, ip, port, etc.
    // TBD: What the need if dir and files selection download is constructed by a client anyway.
    resource.downloadUrl = `/api/download?items=${id}`;
  } else {
    throw new Error(UNKNOWN_RESOURCE_TYPE_ERROR);
  }

  return resource;
}
module.exports = {
  UNKNOWN_RESOURCE_TYPE_ERROR,
  checkTitle,
  id2path,
  path2id,
  stat2resource
}
