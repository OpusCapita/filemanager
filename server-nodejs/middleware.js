'use strict';

const router = require('./router');
const logger = require('./logger');

module.exports = function(config = require('./config/server-config')) {
  const host = config.host;
  const port = config.port;

  const options = {
    fsRoot: config.fsRoot,
    rootTitle: config.rootTitle,
    logger
  };

  return router(options);
};
