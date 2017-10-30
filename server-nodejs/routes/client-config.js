'use strict';

const getClientIp = require('../utils/get-client-ip');

module.exports = ({ options, req, res }) =>
  options.getClientConfig().
    then(clientConfig => {
      options.logger.info(`client-config requested by ${getClientIp(req)}`);
      res.json(clientConfig);
    }).
    catch(err => {
      options.logger.error(err);
      res.status(500).end();
    });
