'use strict';

const compression = require('compression');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');
const host = require('../.env').HOST;
const port = require('../.env').PORT;
const fileserverurl = require('../.env').FILE_SERVER_URL;
const webpack = require('webpack');
const compiler = webpack(require('../config/webpack.config'));
const env = require('../.env');

env.SERVER_URL = `http://${host}:${port}`;

const app = express();

let serverOptions = {
  watchOptions: {
    aggregateTimeout: 2000,
    poll: 2000
  },
  headers: {'Access-Control-Allow-Origin': '*'},
  noInfo: true,
  stats: {colors: true}
};

try {
  fs.mkdirSync(path.resolve(__dirname, './static'));
} catch(e) {}

fs.writeFileSync(
  path.resolve(__dirname, './static/env.js'),
  'window.env = ' + JSON.stringify(env) + ';'
);

app.use(compression());
app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(express.static(path.resolve(__dirname, './static')));

app.get('/', function(req, res) {
  res.sendFile(path.normalize(__dirname + '/index.html'));
});

app.use('/**', createProxyMiddleware({ target: fileserverurl, followRedirects: true, changeOrigin: false}));

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`The client react server is running at http://${host}:${port}/\nfilemanager server is expecting at ${fileserverurl}`);
});
