'use strict';

const router = require('./router');
const logger = require('./logger');

module.exports = (config = require('./config/server-config')) => router({
  fsRoot: config.fsRoot,
  rootName: config.rootName,
  logger
});
