'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const registerRoutes = require('./routes');
const logger = require('./logger');

function run(config = require('./config/server-config')) {
  const app = express();
  app.use(bodyParser.json());
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  const host = config.host;
  const port = config.port;

  const options = {
    fsRoot: config.fsRoot,
    rootTitle: config.rootTitle,
    logger
  };

  registerRoutes(app, options);

  app.listen(port, host, function(err) {
    if (err) {
      logger.error(err);
    }

    logger.info(`Server listening at http://${host}:${port}`);
  });
};


process.on('exit', function() {
  logger.warn('Server has been stopped');
});

module.exports = {
  run
};
