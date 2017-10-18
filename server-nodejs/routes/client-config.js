'use strict';

let getClientIp = require('../utils/get-client-ip');

module.exports = (app, options) => {
  const { logger } = options;

  app.get('/client-config', (req, res) => {
    options.getClientConfig().
      then((data) => {
        logger.info(`client-config requested by ${getClientIp(req)}`);
        res.status(200).json(data).end();
      }).
      catch((err) => {
        logger.error(err);
        res.status(500).end();
      });
  });
};
