'use strict';

let path = require('path');
let fs = require('fs');
let fse = require('fs-extra');
let getClientIp = require('../utils/get-client-ip');

module.exports = (app, options) => {
  const { logger } = options;

  app.get('/files/*', (req, res) => {
    let relativePath = req.params[0] || '.';
    logger.info(`Files config requested by ${getClientIp(req)}`);
  });
};
