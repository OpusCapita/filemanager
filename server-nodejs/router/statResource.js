'use strict';

const path = require('path');
const fs = require('fs-extra');
const getClientIp = require('../utils/get-client-ip');

const { stat2resource } = require('./lib');

module.exports = ({
  options,
  req,
  res,
  handleError,
  path: userPath
}) => {
  const absPath = path.join(options.fsRoot, userPath);
  options.logger.info(`Stat for ${absPath} requested by ${getClientIp(req)}`);

  fs.stat(absPath).
    then(stat2resource(options, userPath)).
    then(resource => res.json(resource)).
    catch(handleError);
};
