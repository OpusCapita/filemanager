'use strict';

const path = require('path');
const fs = require('fs-extra');

const getClientIp = require('../utils/get-client-ip');

const {
  checkName,
  id2path,
  getResource
} = require('./lib');

const MAX_RETRIES = 3;
const ERROR_TARGET_EXISTS = 'EEXIST';

module.exports = ({
  config,
  req,
  res,
  handleError,
  path: relativeItemPath
}) => {
  if (config.readOnly) {
    return handleError(Object.assign(
      new Error(`File Manager is in read-only mode`),
      { httpCode: 403 }
    ));
  }

  if (relativeItemPath === path.sep) {
    return handleError(Object.assign(
      new Error(`User root must never be renamed/copied/moved`),
      { httpCode: 400 }
    ));
  }

  const {
    parents: parentIds = [],
    name: reqBasename
  } = req.body;

  let basename = reqBasename;

  if (parentIds.length > 2) {
    return handleError(Object.assign(
      new Error(`Invalid number of parents`),
      { httpCode: 400 }
    ));
  }

  const absItemPath = path.join(config.fsRoot, relativeItemPath);
  const relativeParentPaths = parentIds.map(id => id2path(id));
  const absParentPaths = relativeParentPaths.map(relativeParentPath => path.join(config.fsRoot, relativeParentPath));
  let targetAbsPath, operation, targetRelativePath;

  if (parentIds.length === 0) {
    config.logger.info(`Rename ${absItemPath} requested by ${getClientIp(req)}`);

    try {
      checkName(basename);
    } catch (err) {
      return handleError(Object.assign(
        err,
        { httpCode: 400 }
      ));
    }

    targetRelativePath = path.dirname(relativeItemPath);
    targetAbsPath = path.dirname(absItemPath);
    operation = fs.move;
  } else {
    config.logger.info(`Copy/move ${absItemPath} requested by ${getClientIp(req)}`);

    if (basename) {
      try {
        checkName(basename);
      } catch (err) {
        return handleError(Object.assign(
          err,
          { httpCode: 400 }
        ));
      }
    } else {
      basename = path.basename(absItemPath);
    }

    if (parentIds.length === 2) {
      switch (path.dirname(absItemPath)) { // eslint-disable-line default-case
        case absParentPaths[0]:
          targetRelativePath = relativeParentPaths[1];
          targetAbsPath = absParentPaths[1]
          break;
        case absParentPaths[1]:
          targetRelativePath = relativeParentPaths[0];
          targetAbsPath = absParentPaths[0];
          break;
      }

      if (!targetAbsPath) {
        return handleError(Object.assign(
          new Error(`Current parent must be among parents`),
          { httpCode: 400 }
        ));
      }

      operation = fs.copy;
    } else {
      targetRelativePath = relativeParentPaths[0];
      targetAbsPath = absParentPaths[0];
      operation = path.dirname(absItemPath) === absParentPaths[0] ?
        fs.copy :
        fs.move;
    }
  }

  return (function retriedPromise(maxRetries, counter = 1) {
    return new Promise((resolve, reject) => fs.readdir(targetAbsPath).
      then(basenames => {
        let base = basename;

        if (basenames.includes(base)) {
          const { name, ext } = path.parse(base);
          let suffix = 1;

          do {
            base = `${name} (${suffix++})${ext}`;
          } while (basenames.includes(base));
        }

        return base;
      }).
      then(base => operation(absItemPath, path.join(targetAbsPath, base)).
        then(_ => resolve(basename = base))
      ).
      catch(err => (counter < maxRetries && err.code === ERROR_TARGET_EXISTS) ?
        retriedPromise(maxRetries, counter + 1).
          then(resolve).
          catch(reject) :
        reject(err)
      )
    );
  }(MAX_RETRIES)).
    then(_ => getResource({
      config,
      parent: targetRelativePath,
      basename
    })).
    then(resource => res.json(resource)).
    catch(handleError);
};
