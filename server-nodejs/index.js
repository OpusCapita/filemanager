'use strict';

let registerRoutes = require('./routes');
let logger = require('./logger');
let express = require('express');
let bodyParser = require('body-parser');

let serverConfig = require('./config/server-config');
let host = serverConfig.host;
let port = serverConfig.port;
let getClientConfig = serverConfig.getClientConfig; // promise


let app = express();
app.use(bodyParser.json());

let options = {
  getClientConfig,
  logger,
  fsRoot: serverConfig.fsRoot
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
