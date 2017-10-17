'use strict';

const serverConfig = require('./config/server-config');
const fsRoot = serverConfig.fsRoot;
const host = serverConfig.host;
const port = serverConfig.port;
const getClientConfig = serverConfig.getClientConfig; // promise
const logger = require('./logger');

let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let routes = require('./routes');

app.use(bodyParser.json());
routes(app, { getClientConfig, logger });

const server = app.listen(port, host, function(err) {
  if (err) {
    logger.error(err);
  }

  logger.info(`Server listening at http://${host}:${port}`);
});

process.on('exit', function (){
  logger.warn('Server has been stopped');
});
