'use strict';
const express = require('express');
const filemanagerMiddleware = require('./middleware');
const logger = require('./logger');

const app = express();

function run(config = require('./config/server-config')) {
  const host = config.host;
  const port = config.port;

  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

  app.use(filemanagerMiddleware(config));

  app.listen(port, host, function(err) {
    if (err) {
      logger.error(err);
    }

    logger.info(`Server listening at http://${host}:${port}`);
  });

  process.on('exit', function() {
    logger.warn('Server has been stopped');
  });
}

module.exports = {
  run
};
