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
  config,
  req,
  res,
  handleError,
  path: userPath
}) => {
  let sorter;

  if (config.users && req.session.user === undefined) {
    return handleError(Object.assign(
      new Error(`Session expired.`),
      { httpCode: 419 }
    ));    
  }  

  try {
    sorter = getSorter({
      caseSensitive: false,
      orderBy: req.query.orderBy,
      orderDirection: req.query.orderDirection
    });
  } catch (err) {
    return handleError(err);
  }

  const absPath = path.join(config.fsRoot, userPath);
  config.logger.info(`Children for ${absPath} requested by ${getClientIp(req)}`);
  
  return fs.readdir(absPath).
    then(basenames => Promise.all(
      basenames.
        map(
          basename => getResource({
            config,
            session: req.session,
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
    then(resources => res.json({
      items: resources.sort(sorter)
    })).
    catch(handleError);
};
