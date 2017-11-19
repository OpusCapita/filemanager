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

var jsdom = require('jsdom').jsdom;
var chai = require('chai');

chai.use(require('sinon-chai'));
chai.use(require('chai-enzyme')());

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;
