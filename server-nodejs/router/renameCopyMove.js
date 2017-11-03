'use strict';

const path = require('path');
const fs = require('fs-extra');

const getClientIp = require('../utils/get-client-ip');

const {
  checkName,
  id2path,
  stat2resource
} = require('./lib');

const MAX_RETRIES = 3;
const ERROR_TARGET_EXISTS = 'EEXIST';

module.exports = ({
  options,
  req,
  res,
  path: relativeItemPath
}) => {
  if (relativeItemPath === path.sep) {
    options.logger.error(`User root must never be renamed/copied/moved, contrary to requested by ${getClientIp(req)}`);
    res.status(204).end();
    return;
  }

  const {
    parents: parentIds = [],
    name: reqBasename
  } = req.body;

  let basename = reqBasename;

  if (parentIds.length > 2) {
    options.logger.error(`Invalid number of parents requested by ${getClientIp(req)}`);
    res.status(204).end();
    return;
  }

  const absItemPath = path.join(options.fsRoot, relativeItemPath);
  const relativeParentPaths = parentIds.map(id => id2path(id));
  const absParentPaths = relativeParentPaths.map(relativeParentPath => path.join(options.fsRoot, relativeParentPath));
  let targetAbsPath, operation, targetRelativePath;

  if (parentIds.length === 0) {
    options.logger.info(`Rename ${absItemPath} requested by ${getClientIp(req)}`);

    try {
      checkName(basename);
    } catch (err) {
      options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
      res.status(204).end();
      return;
    }

    targetRelativePath = path.dirname(relativeItemPath);
    targetAbsPath = path.dirname(absItemPath);
    operation = fs.move;
  } else {
    options.logger.info(`Copy/move ${absItemPath} requested by ${getClientIp(req)}`);

    if (basename) {
      try {
        checkName(basename);
      } catch (err) {
        options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
        res.status(204).end();
        return;
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
        options.logger.error(`Current parent must be among parents request by ${getClientIp(req)}: ${err}`);
        res.status(204).end();
        return;
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

  (function retriedPromise(maxRetries, counter = 1) {
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
    then(_ => fs.stat(path.join(targetAbsPath, basename))).
    then(stat => stat2resource(options, {  // stat2resource must be called _after_ promise resolution!
      dir: targetRelativePath,
      basename
    })(stat)).
    then(resource => res.json(resource)).
    catch(err => {
      options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
      res.status(204).end();
    });
};
