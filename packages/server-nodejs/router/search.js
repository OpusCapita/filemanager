'use strict';

const path = require('path');
const fs = require('fs-extra');

const getClientIp = require('../utils/get-client-ip');
const { TYPE_FILE, TYPE_DIR } = require('../constants');
const { getResource } = require('./lib');

module.exports = ({
  options,
  req,
  res,
  handleError,
  path: userPath
}) => {
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
              catch(err => {
                if (err) {
                  throw err;
                }
              }),
            recursive && stat.isDirectory() ? readTree(childPath) : []
          ])).
          then(([item, items]) => item ? [item, ...items] : items);
      })
    )).
    then(arrayOfArrays => [].concat(...arrayOfArrays)); // Flattening an array of arrays.

  return readTree(userPath).
    then(items => res.json({ items })).
    catch(handleError);
};
