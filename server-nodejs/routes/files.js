'use strict';

let path = require('path');
let fs = require('fs-extra');
let getClientIp = require('../utils/get-client-ip');
let asyncMiddleware = require('../utils/async-middleware');

module.exports = (app, options) => {
  const { logger } = options;

  app.get('/files*', asyncMiddleware(async (req, res, next) => {
    let { fsRoot } = options;
    let relativePath = decodeURIComponent(req.params[0] || '.');
    let absolutePath = path.resolve(fsRoot, './' + relativePath);

    logger.info(`Files config for ${absolutePath} requested by ${getClientIp(req)}`);

    let fileStats = await fs.stat(absolutePath).catch((err) => {
      logger.error(err);
      res.status(204).end();
    });

    if (!fileStats) {
      return;
    }

    let resourceRepresentation = {
      id: relativePath, // /home/user/adsfsdf.md 24234klfasdj;fasdk234
      label: 'file1.md',
      isDirectory: fileStats.isDirectory(),
      createDate: fileStats.birthtime,
      modifiedDate: fileStats.mtime,
      size: fileStats.size
    };

    res.status(200).json(resourceRepresentation).end();
  }));
};
