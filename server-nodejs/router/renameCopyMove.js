'use strict';

const path = require('path');
const fs = require('fs-extra');
const getClientIp = require('../utils/get-client-ip');

const {
  checkName,
  id2path,
  stat2resource
} = require('./lib');

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
      operation = fs.move;
    }
  }

  fs.readdir(targetAbsPath).
    then(basenames => {
      if (basenames.includes(basename)) {
        const { name, ext } = path.parse(basename);
        let suffix = 1;

        do {
          basename = `${name} (${suffix++})${ext}`;
        } while (basenames.includes(basename));
      }
    }).
    then(_ => operation(absItemPath, path.join(targetAbsPath, basename))).
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
