'use strict';
process.env.NODE_ENV = 'test';

require('babel-register')({
  presets: ['es2017', 'es2015', 'stage-0', 'react'],
  plugins: [
    ['transform-runtime', {
      "polyfill": false,
      "regenerator": true
    }],
    'transform-decorators-legacy',
    'lodash'
  ]
});

require('chai');
