'use strict';

const path = require('path');
const fs = require('fs-extra');
const getClientIp = require('../utils/get-client-ip');

module.exports = ({
  options,
  req,
  res,
  handleError,
  path: userPath
}) => {
  if (userPath === path.sep) {
    return handleError(Object.assign(
      new Error(`User root must never be deleted`),
      { httpCode: 400 }
    ));
  }

  const absPath = path.join(options.fsRoot, userPath);
  options.logger.info(`Delete ${absPath} requested by ${getClientIp(req)}`);

  return fs.remove(absPath).
    then(_ => res.status(200).end()).
    catch(handleError);
};
