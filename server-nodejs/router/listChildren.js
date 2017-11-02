'use strict';

const path = require('path');
const fs = require('fs-extra');
const getClientIp = require('../utils/get-client-ip');

const {
  UNKNOWN_RESOURCE_TYPE_ERROR,
  stat2resource
} = require('./lib');

const { TYPE_DIR } = require('../constants');

module.exports = ({
  options,
  req,
  res,
  path: userPath
}) => {
  const absPath = path.join(options.fsRoot, userPath);
  options.logger.info(`Children for ${absPath} requested by ${getClientIp(req)}`);

  fs.readdir(absPath).
    then(basenames =>
      Promise.all(basenames.map(basename => fs.stat(path.join(absPath, basename)))).
        then(stats => stats.reduce(
          (rez, stat, i) => {
            try {
              rez.push(stat2resource(options, {
                dir: userPath,
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
            (itemB.type === TYPE_DIR) - (itemA.type === TYPE_DIR) || itemA.name.localeCompare(itemB.name)
            // TODO: add user locale as 2nd argument to the above localeCompare() function.
          )).
        then(items => res.json({ items }))
    ).
    catch(err => {
      options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
      res.status(204).end();
    });
};
