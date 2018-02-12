'use strict';

const path = require('path');
const fs = require('fs-extra');

const getClientIp = require('../utils/get-client-ip');
const { TYPE_FILE, TYPE_DIR } = require('../constants');
const { getResource } = require('./lib');

const RESPONSE_TIMEOUT = process.env.NODE_ENV === 'development' ? 10 : 3000;
const CACHE_TIMEOUT = process.env.NODE_ENV === 'development' ? 99000 : 20000;
const gCache = {};

const buildCacheId = req => {
  return (Date.now().toString() - new Date(2018, 0, 1)).toString() + getClientIp(req).replace(/\./g, '');
}

const sendAvailable = ({ cacheId, req, res, handleError }) => {
  const cacheItems = gCache[cacheId]; // an array with two optional custom properties: "finished" and "timeoutId".

  if (!cacheItems) {
    return handleError(Object.assign(
      new Error(`Search cache with ID "${cacheId}" does not exist`),
      { httpCode: 410 }
    ));
  }

  if (cacheItems.timeoutId) {
    clearTimeout(cacheItems.timeoutId);
  }

  const sendObj = {
    items: cacheItems.splice(0)
  };

  if (cacheItems.finished) {
    delete gCache[cacheId];
  } else {
    sendObj.next = req.path + '?cacheId=' + cacheId;
    cacheItems.timeoutId = setTimeout(_ => delete gCache[cacheId], CACHE_TIMEOUT);
  }

  return res.json(sendObj);
};

module.exports = ({
  options,
  req,
  res,
  handleError,
  path: userPath
}) => {
  if (req.query.cacheId) {
    return sendAvailable({
      cacheId: req.query.cacheId,
      req,
      res,
      handleError
    });
  }

  let recursive = true; // Assigning default value.

  if (req.query.hasOwnProperty('recursive')) {
    recursive = req.query.recursive;

    if (!['true', 'false'].includes(recursive)) {
      return handleError(Object.assign(
        new Error(`Invalid "recursive" parameter value ${recursive}`),
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
        new Error(`Invalid "itemNameCaseSensitive" parameter value ${itemNameCaseSensitive}`),
        { httpCode: 400 }
      ));
    }

    itemNameCaseSensitive = itemNameCaseSensitive === 'true';
  }

  let itemType = [TYPE_FILE, TYPE_DIR]; // Assigning default value.

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
        new Error(`Invalid "itemType" parameter value ${itemType}`),
        { httpCode: 400 }
      ));
    }

    if (!Array.isArray(itemType)) {
      itemType = [itemType];
    }
  }

  let itemNameSubstring = ''; // Assigning default value.

  if (req.query.hasOwnProperty('itemNameSubstring')) {
    itemNameSubstring = req.query.itemNameSubstring;

    if (typeof itemNameSubstring !== 'string') {
      return handleError(Object.assign(
        new Error(`Invalid "itemNameSubstring" parameter value ${itemNameSubstring}`),
        { httpCode: 400 }
      ));
    }

    if (!itemNameCaseSensitive) {
      itemNameSubstring = itemNameSubstring.toLowerCase();
    }
  }

  const getConditions = ({ stat, basename }) => {
    // Each condition is a function returning a promise which
    // resolves if condition is satisfied and rejects otherwise.
    // Both resolved and rejected values must be undefined (to differentiate from JavaScript errors).
    const conditions = [
      _ => new Promise((resolve, reject) =>
        itemType.includes(TYPE_DIR) && stat.isDirectory() ||
        itemType.includes(TYPE_FILE) && stat.isFile() ?
        resolve() :
        reject()
      ),
    ];

    if (itemNameSubstring) { // Search for a particular substring in item name.
      conditions.push(
        _ => new Promise((resolve, reject) =>
          (itemNameCaseSensitive ? basename : basename.toLowerCase()).
            includes(itemNameSubstring) ?
          resolve() :
          reject()
        )
      );
    }

    return conditions;
  };

  const absPath = path.join(options.fsRoot, userPath);
  options.logger.info(`Search inside ${absPath} requested by ${getClientIp(req)}`);

  const cacheItems = [];

  const readTree = parentPath => fs.readdir(path.join(options.fsRoot, parentPath)).
    then(basenames => Promise.all(
      basenames.map(basename => {
        const childPath = path.join(parentPath, basename);

        return fs.stat(path.join(options.fsRoot, childPath)).
          then(stat => Promise.all([
            Promise.all(
              getConditions({ stat, basename }).map(condition => condition())
            ).
              then(_ => getResource({
                options,
                stat,
                path: childPath
              })).
              then(resource => cacheItems.push(resource)).
              catch(err => { // err === undefined when at least one condition was not satisfied.
                if (err) {
                  throw err; // JavaScript error occured inside a condition.
                }
              }),
            recursive && stat.isDirectory() && readTree(childPath)
          ]));
      })
    ));

  return Promise.race([
    new Promise((resolve, reject) => setTimeout(_ => resolve(), RESPONSE_TIMEOUT)),
    readTree(userPath).then(_ => { cacheItems.finished = true; })
  ]).
    then(_ => {
      if (cacheItems.finished) {
        return res.json({
          items: cacheItems
        });
      }

      const cacheId = buildCacheId(req);
      gCache[cacheId] = cacheItems;
      return sendAvailable({ cacheId, req, res, handleError });
    }).
    catch(handleError);
};
