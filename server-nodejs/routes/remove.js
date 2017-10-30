'use strict';

const path = require('path');
const fs = require('fs-extra');
const getClientIp = require('../utils/get-client-ip');

const { id2path } = require('./lib');

module.exports = ({ options, req, res }) => {
  const id = req.params.id;
  let reqPath;

  try {
    reqPath = id2path(id);
  } catch (err) {
    options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
    res.status(204).end();
    return;
  }

  if (reqPath === '/') {
    options.logger.error(`User root must never be deleted, as requested by ${getClientIp(req)}`);
    res.status(204).end();
    return;
  }

  const absPath = path.resolve(options.fsRoot, '.' + reqPath.replace(/\//g, path.sep));
  options.logger.info(`Delete ${absPath} requested by ${getClientIp(req)}`);

  fs.remove(absPath).
    then(_ => res.status(200).end()).
    catch(err => {
      options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
      res.status(204).end();
    });
};
