'use strict';

const compression = require('compression');
const express = require('express');
const fs = require('fs');
const host = require('../.env').HOST;
const path = require('path');
const port = require('../.env').PORT;
const webpack = require('webpack');
const compiler = webpack(require('../config/webpack.config'));

const app = express();

let serverOptions = {
  watchOptions: {
    aggregateTimeout: 300,
    poll: true
  },
  headers: {'Access-Control-Allow-Origin': '*'},
  noInfo: true,
  stats: {colors: true}
};

app.use(compression());
app.use(require('webpack-dev-middleware')(compiler, serverOptions));

app.get('/', function(req, res) {
  res.sendFile(path.normalize(__dirname + '/index.html'));
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`The server is running at http://${host}:${port}/`);
});
