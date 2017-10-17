'use strict';

let path = require('path');
let fs = require('fs');
let fse = require('fs-extra');

module.exports = function(app, options) {
  const { logger } = options;

  app.get('/client-config', (req, res) => {
    options.getClientConfig().
      then((data) => {
        var clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        logger.info(`Client config requested by ${clientIp}`);
      }).
      catch((err) => {
        logger.error(err);
      });
  });

  app.get('/files/*', (req, res) => {
    let relativePath = req.params[0] || '.';

  });
};
