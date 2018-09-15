'use strict';

const path = require('path');
const fs = require('fs-extra');
const getClientIp = require('../utils/get-client-ip');

module.exports = ({
  config,
  req,
  res,
  handleError,
  path: userPath
}) => {
  if (config.readOnly) {
    return handleError(Object.assign(
      new Error(`File Manager is in read-only mode`),
      { httpCode: 403 }
    ));
  }

  if (userPath === path.sep) {
    return handleError(Object.assign(
      new Error(`User root must never be deleted`),
      { httpCode: 400 }
    ));
  }

  const absPath = path.join(config.fsRoot, userPath);
  config.logger.info(`Delete ${absPath} requested by ${getClientIp(req)}`);

  return fs.remove(absPath).
    then(_ => res.status(200).end()).
    catch(handleError);
};
