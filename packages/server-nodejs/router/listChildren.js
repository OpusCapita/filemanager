'use strict';

const path = require('path');
const fs = require('fs-extra');
const getClientIp = require('../utils/get-client-ip');

const {
  UNKNOWN_RESOURCE_TYPE_ERROR,
  getResource,
  getSorter
} = require('./lib');

module.exports = ({
  options,
  req,
  res,
  handleError,
  path: userPath
}) => {
  let sorter;

  try {
    sorter = getSorter(req.query);
  } catch (err) {
    return handleError(err);
  }

  const absPath = path.join(options.fsRoot, userPath);
  options.logger.info(`Children for ${absPath} requested by ${getClientIp(req)}`);

  return fs.readdir(absPath).
    then(basenames => Promise.all(
      basenames.
        map(
          basename => getResource({
            options,
            parent: userPath,
            basename
          }).
            catch(err => {
              if (typeof err === 'object' && err.message === UNKNOWN_RESOURCE_TYPE_ERROR) {
                return null;
              }

              throw err;
            })
        ).
        filter(resource => resource)
    )).
    then(items => res.json({
      items: items.sort(sorter)
    })).
    catch(handleError);
};
