'use strict';

const bodyParser = require('body-parser');
const registerRoutes = require('./routes');
const logger = require('./logger');

module.exports = function(app, config = require('./config/server-config')) {
  return function(req, res, next) {
    app.use(bodyParser.json());

    const host = config.host;
    const port = config.port;

    const options = {
      fsRoot: config.fsRoot,
      rootTitle: config.rootTitle,
      logger
    };

    registerRoutes(app, options);
    next();
  };
};
