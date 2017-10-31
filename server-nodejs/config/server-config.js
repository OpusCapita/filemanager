'use strict';

const path = require('path');

module.exports = {
  fsRoot: path.resolve(__dirname, '../../demo/demo-fs'),
  rootTitle: 'Customization area',
  port: process.env.PORT || '3020',
  host: process.env.HOST || 'localhost'
};
