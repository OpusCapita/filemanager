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
  if (config.users && !!req.session.user) {
    return handleError(Object.assign(
      new Error(`Session expired.`),
      { httpCode: 419 }
    ));    
  }
    
  config.logger.info(`Stat for ${path.join(config.fsRoot, userPath)} requested by ${getClientIp(req)}`);

  getResource({
    config,
    session: req.session,
    path: userPath
  }).
    then(resource => res.json(resource)).
    catch(handleError);
};
