'use strict';

const path = require('path');
const fs = require('fs-extra');
const getClientIp = require('../utils/get-client-ip');

const {
  UNKNOWN_RESOURCE_TYPE_ERROR,
  id2path,
  stat2resource
} = require('./lib');

const { TYPE_DIR } = require('../constants');

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

  const absPath = path.resolve(options.fsRoot, '.' + reqPath.replace(/\//g, path.sep));
  options.logger.info(`Children for ${absPath} requested by ${getClientIp(req)}`);

  fs.readdir(absPath).
    then(basenames =>
      Promise.all(basenames.map(basename => fs.stat(absPath + path.sep + basename))).
        then(stats => stats.reduce(
          (rez, stat, i) => {
            try {
              rez.push(stat2resource(options, {
                dir: reqPath,
                basename: basenames[i]
              })(stat));
            } catch (err) {
              if (err.message !== UNKNOWN_RESOURCE_TYPE_ERROR) {
                throw err;
              }
            }

            return rez;
          },
          []
        )).
        then(items =>
          items.sort((itemA, itemB) =>
            (itemB.type === TYPE_DIR) - (itemA.type === TYPE_DIR) || itemA.title.localeCompare(itemB.title)
            // TODO: add user locale as 2nd argument to the above localeCompare() function.
          )).
        then(items => res.json({ items }))
    ).
    catch(err => {
      options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
      res.status(204).end();
    });
};
