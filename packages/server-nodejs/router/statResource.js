'use strict';

const path = require('path');

const getClientIp = require('../utils/get-client-ip');
const { getResource } = require('./lib');

module.exports = ({
  config,
  req,
  res,
  handleError,
  path: userPath
}) => {
  config.logger.info(`Stat for ${path.join(config.fsRoot, userPath)} requested by ${getClientIp(req)}`);

  getResource({
    config,
    path: userPath
  }).
    then(resource => res.json(resource)).
    catch(handleError);
};
