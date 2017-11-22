'use strict';

const router = require('./router');
const logger = require('./logger');

module.exports = config => router({
  fsRoot: config.fsRoot,
  rootName: config.rootName,
  logger
});
