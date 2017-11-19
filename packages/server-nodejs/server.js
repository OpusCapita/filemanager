const express = require('express');
const filemanagerMiddleware = require('./middleware');
const config = require('./config/server-config');
const logger = require('./logger');

const app = express();

function run(serverConfig = config) {
  const host = serverConfig.host;
  const port = serverConfig.port;

  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  app.use(filemanagerMiddleware(serverConfig));

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
