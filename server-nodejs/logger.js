'use strict';

// TODO - fix colorize when winston 3.0.0 will be released
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, prettyPrint } = format;
const path = require('path');
const logsDir = path.resolve('/var/log/oc-filemanager');

const logger = createLogger({
  format: combine(
    timestamp(),
    prettyPrint()
  ),
  transports: [
    // new transports.Console({
    //   format: combine(format.colorize()),
    //   level: 'silly'
    // }),
    // new transports.File({
    //   filename: path.resolve(logsDir, './insendents.log'),
    //   level: 'error'
    // }),
    // new transports.File({
    //   filename: path.resolve(logsDir, './insendents.log'),
    //   level: 'warn'
    // }),
    // new transports.File({
    //   filename: path.resolve(logsDir, './info.log'),
    //   level: 'info'
    // }),
    // new transports.File({
    //   filename: path.resolve(logsDir, './info.log'),
    //   level: 'verbose'
    // }),
    // new transports.File({
    //   filename: path.resolve(logsDir, './info.log'),
    //   level: 'silly'
    // }),
    // new transports.File({
    //   filename: path.resolve(logsDir, './debug.log'),
    //   level: 'debug'
    // }),
    // new transports.File({ filename: path.resolve(logsDir, 'combined.log') })
  ]
});

module.exports = logger;
