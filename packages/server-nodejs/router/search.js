'use strict';

const { join } = require('path');

const getClientIp = require('../utils/get-client-ip');
const { TYPE_FILE, TYPE_DIR } = require('../constants');
const getSearchStream = require('./streams/searchStream');

const RESPONSE_TIMEOUT = process.env.NODE_ENV === 'development' ?
  1000 : // XXX: keep unchanged until mocha-tests do not depend on server running with NODE_ENV set to 'development'.
  3000;

const CACHE_TIMEOUT = process.env.NODE_ENV === 'development' ? 99000 : 20000;
const gCache = {};

const buildCacheId = req => {
  return (Date.now() - new Date(2018, 0, 1)).toString() + getClientIp(req).replace(/\./g, '');
}

const clearance = searchStream => {
  searchStream.destroyAll();

  if (searchStream.cacheId) {
    delete gCache[searchStream.cacheId];
  }
};

/* @param [ReadableStream] searchStream
 *        Stream with three optional custom properties: "cacheId", "isFinished" and "timeoutId".
 */
const sendAvailable = ({ searchStream, req, res, handleError }) => { // eslint-disable-line consistent-return
  if (searchStream.timeoutId) {
    clearTimeout(searchStream.timeoutId);
  }

  const rez = {
    items: []
  };

  let resource;

  while (null !== (resource = searchStream.read())) { // eslint-disable-line no-cond-assign
    rez.items.push(resource);
  }

  if (searchStream.isFinished) {
    clearance(searchStream);
  } else {
    if (!searchStream.cacheId) {
      searchStream.cacheId = buildCacheId(req); // eslint-disable-line no-param-reassign
      gCache[searchStream.cacheId] = searchStream;
    }

    rez.nextPage = 'cacheId=' + searchStream.cacheId;
    // eslint-disable-next-line no-param-reassign
    searchStream.timeoutId = setTimeout(clearance, CACHE_TIMEOUT, searchStream);
  }

  res.json(rez);
};

module.exports = async ({
  config,
  req,
  res,
  handleError,
  path: userPath
}) => {
  if (req.query.cacheId) {
    const searchStream = gCache[req.query.cacheId];

    if (!searchStream) {
      return handleError(Object.assign(
        new Error(`Search cache with ID "${req.query.cacheId}" does not exist`),
        { httpCode: 410 }
      ));
    }

    if (searchStream.cacheId !== req.query.cacheId) {
      return handleError(Object.assign(
        new Error(`Search cache "${req.query.cacheId}" and stream cache "${searchStream.cacheId}" mismatch`),
        { httpCode: 410 }
      ));
    }

    return sendAvailable({ searchStream, req, res, handleError });
  }

  let recursive = true; // Assigning default value.

  if (req.query.hasOwnProperty('recursive')) {
    recursive = req.query.recursive;

    if (!['true', 'false'].includes(recursive)) {
      return handleError(Object.assign(
        new Error(`Invalid "recursive" parameter value "${recursive}"`),
        { httpCode: 400 }
      ));
    }

    recursive = recursive === 'true';
  }

  let itemNameCaseSensitive = false; // Assigning default value.

  if (req.query.hasOwnProperty('itemNameCaseSensitive')) {
    itemNameCaseSensitive = req.query.itemNameCaseSensitive;

    if (!['true', 'false'].includes(itemNameCaseSensitive)) {
      return handleError(Object.assign(
        new Error(`Invalid "itemNameCaseSensitive" parameter value "${itemNameCaseSensitive}"`),
        { httpCode: 400 }
      ));
    }

    itemNameCaseSensitive = itemNameCaseSensitive === 'true';
  }

  let itemNameSubstring = ''; // Assigning default value.

  if (req.query.hasOwnProperty('itemNameSubstring')) {
    itemNameSubstring = req.query.itemNameSubstring;

    if (typeof itemNameSubstring !== 'string') {
      return handleError(Object.assign(
        new Error(`Invalid "itemNameSubstring" parameter value "${itemNameSubstring}"`),
        { httpCode: 400 }
      ));
    }
  }

  let fileContentCaseSensitive = false; // Assigning default value.

  if (req.query.hasOwnProperty('fileContentCaseSensitive')) {
    fileContentCaseSensitive = req.query.fileContentCaseSensitive;

    if (!['true', 'false'].includes(fileContentCaseSensitive)) {
      return handleError(Object.assign(
        new Error(`Invalid "fileContentCaseSensitive" parameter value "${fileContentCaseSensitive}"`),
        { httpCode: 400 }
      ));
    }

    fileContentCaseSensitive = fileContentCaseSensitive === 'true';
  }

  let fileContentSubstring = ''; // Assigning default value.

  if (req.query.hasOwnProperty('fileContentSubstring')) {
    fileContentSubstring = req.query.fileContentSubstring;

    if (typeof fileContentSubstring !== 'string') {
      return handleError(Object.assign(
        new Error(`Invalid "fileContentSubstring" parameter value "${fileContentSubstring}"`),
        { httpCode: 400 }
      ));
    }
  }

  let itemType = fileContentSubstring ? // Assigning default value.
    [TYPE_FILE] :
    [TYPE_FILE, TYPE_DIR];

  if (req.query.hasOwnProperty('itemType')) {
    itemType = req.query.itemType;

    if (
      ![TYPE_FILE, TYPE_DIR].includes(itemType) &&
      (
        !Array.isArray(itemType) ||
        itemType.length !== 2 ||
        itemType.some(type => ![TYPE_FILE, TYPE_DIR].includes(type))
      )
    ) {
      return handleError(Object.assign(
        new Error(`Invalid "itemType" parameter value "${itemType}"`),
        { httpCode: 400 }
      ));
    }

    if (!Array.isArray(itemType)) {
      itemType = [itemType];
    }
  }

  if (fileContentSubstring && (itemType.length !== 1 || itemType[0] !== TYPE_FILE)) {
    return handleError(Object.assign(
      new Error(`Invalid "itemType" parameter value "${itemType}" for file content search`),
      { httpCode: 400 }
    ));
  }

  const absPath = join(config.fsRoot, userPath);
  config.logger.info(`Search inside ${absPath} requested by ${getClientIp(req)}`);

  try {
    const searchStream = getSearchStream(absPath, config, {
      itemNameSubstring,
      itemNameCaseSensitive,
      itemType,
      recursive,
      fileContentSubstring,
      fileContentCaseSensitive
    });

    await Promise.race([
      new Promise(resolve => setTimeout(_ => resolve(), RESPONSE_TIMEOUT)),
      new Promise((resolve, reject) => searchStream.
        on('error', (err, resource) => {
          config.logger.error(
            `Error ${resource && resource.path ?
              `processing "${resource.path}"` :
              ''
            } during Search operation request by ${getClientIp(req)}: ${err}` +
            '\n' + (err.stack && err.stack.split('\n'))
          );

          if (resource && resource.path === absPath) {
            clearance(searchStream);
            reject(err);
          }
        }).
        on('finish', () => {
          // All data is buffered in searchStream's buffer and waiting to be consumed.
          searchStream.isFinished = true;
          resolve();
        })
      )
    ]);

    return sendAvailable({ searchStream, req, res, handleError });
  } catch (err) {
    return handleError(err);
  }
};
