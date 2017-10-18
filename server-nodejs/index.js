'use strict';

const serverConfig = require('./config/server-config');
const host = serverConfig.host;
const port = serverConfig.port;
const getClientConfig = serverConfig.getClientConfig; // promise
const registerRoutes = require('./routes');
const logger = require('./logger');

let express = require('express');
let app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.json());
registerRoutes(app, { getClientConfig, logger });

app.listen(port, host, function(err) {
  if (err) {
    logger.error(err);
  }

  logger.info(`Server listening at http://${host}:${port}`);
});

process.on('exit', function() {
  logger.warn('Server has been stopped');
});
