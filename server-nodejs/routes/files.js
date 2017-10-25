'use strict';

const path = require('path');
const fs = require('fs-extra');

const getClientIp = require('../utils/get-client-ip');

const {
  encode: path2id,
  decode: id2path
} = require('../utils/id');

module.exports = (app, options) => app.get('api/files/:id/stats', (req, res) => {
  const id = req.params.id;
  const absolutePath = path.resolve(options.fsRoot, '.' + id2path(id));

  options.logger.info(`Stat for ${absolutePath} requested by ${getClientIp(req)}`);

  fs.stat(absolutePath).
    then(stats => {
      const resourceRepresentation = {
        id,
        title: path.basename(absolutePath),
        type: stats.isDirectory() ?
          'dir' :
          (stats.isFile ? 'file' : 'unknown'),
        createDate: stats.birthtime,
        modifyDate: stats.mtime,
        size: stats.size
      };

      res.json(resourceRepresentation);
    }).
    catch(err => {
      options.logger.error(err);
      res.status(204).end();
    });
});
