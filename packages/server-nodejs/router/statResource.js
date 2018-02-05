'use strict';

const path = require('path');

const getClientIp = require('../utils/get-client-ip');
const { getResource } = require('./lib');

module.exports = ({
  options,
  req,
  res,
  handleError,
  path: userPath
}) => {
  options.logger.info(`Stat for ${path.join(options.fsRoot, userPath)} requested by ${getClientIp(req)}`);

  getResource({
    options,
    path: userPath
  }).
    then(resource => res.json(resource)).
    catch(handleError);
};
