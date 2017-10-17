'use strict';

let path = require('path');
let fse = require('fs-extra');

const clientConfigPath = path.resolve(__dirname, './client-config.json');

module.exports = {
  fsRoot: path.resolve(__dirname, '../../demo-fs'),
  port: process.env.PORT || '3020',
  host: process.env.HOST || 'localhost',
  getClientConfig: () => fse.readFile(clientConfigPath, 'utf-8')
};
