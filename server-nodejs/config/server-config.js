'use strict';

let path = require('path');

const clientConfigPath = path.resolve(__dirname, './client-config.js');

module.exports = {
  fsRoot: path.resolve(__dirname, '../../demo-fs'),
  port: process.env.PORT || '3020',
  host: process.env.HOST || 'localhost',

  getClientConfig: () => new Promise((resolve, reject) => {
    let clientConfig = require(clientConfigPath, 'utf-8');
    resolve(clientConfig);
  })
};
