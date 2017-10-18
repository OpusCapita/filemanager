'use strict';


// TODO - fix colorize when winston 3.0.0 will be released
let { createLogger, format, transports } = require('winston');
let { combine, timestamp, prettyPrint } = format;
let path = require('path');
let logsDir = path.resolve('/var/log/oc-filemanager');

let logger = createLogger({
  format: combine(
    timestamp(),
    prettyPrint()
  ),
  transports: [
    new transports.Console({
      format: combine(format.colorize()),
      level: 'silly'
    }),
    new transports.File({
      filename: path.resolve(logsDir, './insendents.log'),
      level: 'error'
    }),
    new transports.File({
      filename: path.resolve(logsDir, './insendents.log'),
      level: 'warn'
    }),
    new transports.File({
      filename: path.resolve(logsDir, './info.log'),
      level: 'info'
    }),
    new transports.File({
      filename: path.resolve(logsDir, './info.log'),
      level: 'verbose'
    }),
    new transports.File({
      filename: path.resolve(logsDir, './info.log'),
      level: 'silly'
    }),
    new transports.File({
      filename: path.resolve(logsDir, './debug.log'),
      level: 'debug'
    }),
    new transports.File({ filename: path.resolve(logsDir, 'combined.log') })
  ]
});

module.exports = logger;
