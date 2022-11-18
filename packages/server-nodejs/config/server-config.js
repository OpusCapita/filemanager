'use strict';

const path = require('path');

module.exports = {
  fsRoot: path.resolve('./test-files'),
  rootName: 'Customization area',
  readOnly: false,
  edsocket: null, //place holder: editor socket for file loading/storing
  port: process.env.PORT || '3020',
  host: process.env.HOST || 'localhost'
};
