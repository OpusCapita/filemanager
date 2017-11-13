'use strict';

const path = require('path');
const fs = require('fs-extra');
const getClientIp = require('../utils/get-client-ip');

const {
  UNKNOWN_RESOURCE_TYPE_ERROR,
  stat2resource
} = require('./lib');

const { TYPE_DIR } = require('../constants');

const
  ORDER_BY_NAME = 'name',
  ORDER_BY_MODIFIED_TIME = 'modifiedTime',
  DEFAULT_ORDER_BY = ORDER_BY_NAME,

  ORDER_DIRECTION_ASC = 'ASC',
  ORDER_DIRECTION_DESC = 'DESC',
  DEFAULT_ORDER_DIRECTION = ORDER_DIRECTION_ASC;

const sortItems = ({
  orderBy = DEFAULT_ORDER_BY,
  orderDirection = DEFAULT_ORDER_DIRECTION
}) => {
  const sorter = orderBy === ORDER_BY_NAME ?
    (itemA, itemB) => itemA.name.toLowerCase().localeCompare(itemB.name.toLowerCase()) :
    (itemA, itemB) => itemA.modifiedTime - itemB.modifiedTime;

  return items => items.sort((itemA, itemB) =>
    (itemB.type === TYPE_DIR) - (itemA.type === TYPE_DIR) ||
    sorter(...(
      orderDirection === ORDER_DIRECTION_DESC ?
        [itemB, itemA] :
        [itemA, itemB]
    ))
  );
};

module.exports = ({
  options,
  req,
  res,
  handleError,
  path: userPath
}) => {
  if (req.query.orderDirection && ![ORDER_DIRECTION_ASC, ORDER_DIRECTION_DESC].includes(req.query.orderDirection)) {
    return handleError(Object.assign(
      new Error(`Invalid order direction ${req.query.orderDirection}`),
      { httpCode: 400 }
    ));
  }

  if (req.query.orderBy && ![ORDER_BY_NAME, ORDER_BY_MODIFIED_TIME].includes(req.query.orderBy)) {
    return handleError(Object.assign(
      new Error(`Invalid order by ${req.query.orderBy}`),
      { httpCode: 400 }
    ));
  }

  const absPath = path.join(options.fsRoot, userPath);
  options.logger.info(`Children for ${absPath} requested by ${getClientIp(req)}`);

  return fs.readdir(absPath).
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
        ))
    ).
    then(sortItems(req.query)).
    then(items => res.json({ items })).
    catch(handleError);
};
