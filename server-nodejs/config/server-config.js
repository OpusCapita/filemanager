'use strict';

const path = require('path');
const clientConfigPath = path.resolve(__dirname, './client-config.js');

module.exports = {
  fsRoot: path.resolve(__dirname, '../../demo/demo-fs'),
  rootTitle: 'Customization area',
  port: process.env.PORT || '3020',
  host: process.env.HOST || 'localhost',

  // TBD: is clientConfig needed?
  getClientConfig: _ => new Promise((resolve, reject) => {
    const clientConfig = require(clientConfigPath, 'utf-8');
    resolve(clientConfig);
  })
};
