'use strict';

const path = require('path');

module.exports = {
  fsRoot: '/home/volkovich/k8s-fs/helm',
  rootName: 'Helm releases',
  readOnly: false,
  port: process.env.PORT || '3020',
  host: process.env.HOST || 'localhost'
};
