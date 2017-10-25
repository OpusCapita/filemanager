'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const registerRoutes = require('./routes');
const logger = require('./logger');
const serverConfig = require('./config/server-config');

const app = express();
app.use(bodyParser.json());

const host = serverConfig.host;
const port = serverConfig.port;

const options = {
  getClientConfig: serverConfig.getClientConfig, // promise
  fsRoot: serverConfig.fsRoot,
  rootTitle: serverConfig.rootTitle,
  logger
};

registerRoutes(app, options);

app.listen(port, host, function(err) {
  if (err) {
    logger.error(err);
  }

  logger.info(`Server listening at http://${host}:${port}`);
});

process.on('exit', function() {
  logger.warn('Server has been stopped');
});
