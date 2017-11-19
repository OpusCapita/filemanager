'use strict';

const path = require('path');

module.exports = {
  fsRoot: path.resolve('../demo/demo-fs'),
  rootName: 'Customization area',
  port: process.env.PORT || '3020',
  host: process.env.HOST || 'localhost'
};
