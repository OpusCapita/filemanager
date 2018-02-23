// required only by Mocha

process.env.NODE_ENV = 'test';

const JSDOM = require('jsdom').JSDOM;

require("babel-polyfill");

require('babel-register')({
  babelrc: false,
  presets: ['es2017', 'es2015', 'stage-0', 'react'],
  plugins: [
    ['transform-runtime', {
      "polyfill": false,
      "regenerator": true
    }],
    'transform-decorators-legacy',
    'lodash'
  ],
  plugins: [
    "transform-decorators-legacy",
    "transform-class-properties",
    "transform-object-rest-spread"
  ],
  env: {
    test: {

    }
  }
});

const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
Enzyme.configure({ adapter: new Adapter() });

global.document = new JSDOM('<!doctype html><html><body></body></html>');
global.window = global.document.window;
global.document = window.document;
global.navigator = global.window.navigator;
global.self = global.window;
