'use strict';

const path = require('path');
const fs = require('fs-extra');

const getClientIp = require('../utils/get-client-ip');
const { id2path } = require('./lib');

module.exports = ({ options, req, res, handleError }) => {
  const ids = Array.isArray(req.query.items) ? req.query.items : [req.query.items];
  const preview = req.query.preview === 'true';
  let reqPaths;

  try {
    reqPaths = ids.map(id => id2path(id));
  } catch (err) {
    return handleError(Object.assign(
      err,
      { httpCode: 400 }
    ));
  }

  const absPaths = reqPaths.map(reqPath => path.join(options.fsRoot, reqPath));
  options.logger.info(`Download ${absPaths} requested by ${getClientIp(req)}`);

  if (absPaths.length === 1) {
    return fs.stat(absPaths[0]).
      then(stat => {
        if (stat.isDirectory()) {
          res.zip({
            files: [{
              path: absPaths[0],
              name: absPaths[0] === options.fsRoot ? options.rootName : path.basename(absPaths[0])
            }],
            filename: (absPaths[0] === options.fsRoot ? options.rootName : path.basename(absPaths[0])) + '.zip'
          });
        } else if (preview) {
          // Sets the Content-Type response HTTP header field based on the filename’s extension.
          // The Content-Disposition is not set, i.e. "inline" parameter is the default for a browser.
          res.sendFile(absPaths[0]);
        } else {
          // Sets the Content-Type response HTTP header field based on the filename’s extension.
          // Sets the Content-Disposition with "attachment" and "filename" equal to path.basename(absPaths[0])
          res.download(absPaths[0]);
        }
      }).
      catch(handleError);
  }

  /* ████████████████████████████████████████████████████████████████████ *\
   * ███ Download muliple files/dirs by packing them into zip archive ███ *
  \* ████████████████████████████████████████████████████████████████████ */

  const parentPath = path.dirname(absPaths[0]);

  if (absPaths.slice(1).some(absPath => path.dirname(absPath) !== parentPath)) {
    return handleError(Object.assign(
      new Error(`All items must be from one folder`),
      { httpCode: 400 }
    ));
  }

  return res.zip({
    files: absPaths.map(absPath => ({ // TODO: handle situation when none of absPaths exists.
      path: absPath,
      name: path.basename(absPath)
    })),
    filename: (parentPath === options.fsRoot ? options.rootName : path.basename(parentPath)) + '.zip'
  }).
    catch(handleError);
};
