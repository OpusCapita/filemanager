'use strict';

const router = require('./router');
const logger = require('./logger');

module.exports = config => router({
  fsRoot: config.fsRoot,
  rootName: config.rootName,
  users: config.users,
  readOnly: config.readOnly,
  edsocket: config.edsocket,
  logger: config.logger || logger
});
