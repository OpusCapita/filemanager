'use strict';

const path = require('path');
const fs = require('fs-extra');
const getClientIp = require('../utils/get-client-ip');

const { id2path } = require('./lib');

module.exports = ({ options, req, res }) => {
  const ids = Array.isArray(req.query.items) ? req.query.items : [req.query.items];
  let reqPaths;

  try {
    reqPaths = ids.map(id => id2path(id));
  } catch (err) {
    options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
    res.status(204).end();
    return;
  }

  const absPaths = reqPaths.map(reqPath => path.join(options.fsRoot, reqPath));
  options.logger.info(`Download ${absPaths} requested by ${getClientIp(req)}`);

  if (absPaths.length === 1) {
    fs.stat(absPaths[0]).
      then(stat => {
        if (stat.isDirectory()) {
          res.zip({
            files: [{
              path: absPaths[0],
              name: absPaths[0] === options.fsRoot ? options.rootName : path.basename(absPaths[0])
            }],
            filename: (absPaths[0] === options.fsRoot ? options.rootName : path.basename(absPaths[0])) + '.zip'
          });
        } else {
          res.download(absPaths[0]);
        }
      }).
      catch(err => {
        options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
        res.status(204).end();
      });

    return;
  }

  /* ████████████████████████████████████████████████████████████████████ *\
   * ███ Download muliple files/dirs by packing them into zip archive ███ *
  \* ████████████████████████████████████████████████████████████████████ */

  const parentPath = path.dirname(absPaths[0]);

  if (absPaths.slice(1).some(absPath => path.dirname(absPath) !== parentPath)) {
    options.logger.error(`Error processing request by ${getClientIp(req)}: all items must be from one folder`);
    res.status(204).end();
    return;
  }

  res.zip({
    files: absPaths.map(absPath => ({ // TODO: handle situation when none of absPaths exists.
      path: absPath,
      name: path.basename(absPath)
    })),
    filename: (parentPath === options.fsRoot ? options.rootName : path.basename(parentPath)) + '.zip'
  }).
    catch(err => {
      options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
      res.status(204).end();
    });
};
