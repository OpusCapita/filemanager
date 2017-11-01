'use strict';

const path = require('path');
const fs = require('fs-extra');
const getClientIp = require('../utils/get-client-ip');

const {
  id2path,
  stat2resource
} = require('./lib');

module.exports = ({ options, req, res }) => {
  const id = req.params.id;
  let reqPath;

  if (id) {
    try {
      reqPath = id2path(id);
    } catch (err) {
      options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
      res.status(204).end();
      return;
    }
  } else {
    reqPath = '/';
  }

  const absPath = path.resolve(options.fsRoot, '.' + reqPath.replace(/\//g, path.sep));
  options.logger.info(`Stat for ${absPath} requested by ${getClientIp(req)}`);

  fs.stat(absPath).
    then(stat2resource(options, reqPath)).
    then(resource => res.json(resource)).
    catch(err => {
      options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
      res.status(204).end();
    });
};
