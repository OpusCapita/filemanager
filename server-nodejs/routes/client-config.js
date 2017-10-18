'use strict';

let getClientIp = require('../utils/get-client-ip');
let asyncMiddleware = require('../utils/async-middleware');

module.exports = (app, options) => {
  const { logger } = options;

  app.get('/client-config', asyncMiddleware(async (req, res) => {
    let clientConfig = await options.getClientConfig().
      catch((err) => {
        logger.error(err);
        res.status(500).end();
      });

    logger.info(`client-config requested by ${getClientIp(req)}`);
    res.status(200).json(clientConfig).end();
  }));
};
