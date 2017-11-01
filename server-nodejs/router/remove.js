'use strict';

const path = require('path');
const fs = require('fs-extra');
const getClientIp = require('../utils/get-client-ip');

module.exports = ({
  options,
  req,
  res,
  path: userPath
}) => {
  if (userPath === path.sep) {
    options.logger.error(`User root must never be deleted, contrary to requested by ${getClientIp(req)}`);
    res.status(204).end();
    return;
  }

  const absPath = path.join(options.fsRoot, userPath);
  options.logger.info(`Delete ${absPath} requested by ${getClientIp(req)}`);

  fs.remove(absPath).
    then(_ => res.status(200).end()).
    catch(err => {
      options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
      res.status(204).end();
    });
};
