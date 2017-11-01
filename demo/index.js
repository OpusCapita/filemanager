const fs = require('fs');
const path = require('path');
const express = require('express');
const filemanagerMiddleware = require('@opuscapita/filemanager-server').middleware;
const logger = require('@opuscapita/filemanager-server').logger;
const env = require('./.env');

const config = {
  fsRoot: path.resolve(__dirname, './demo-fs'),
  rootTitle: 'Customization area',
  port: process.env.PORT || '3020',
  host: process.env.HOST || 'localhost'
};

const app = express();
const host = config.host;
const port = config.port;

fs.writeFileSync(
  path.resolve(__dirname, './static/env.js'),
  'window.env = ' + JSON.stringify(env) + ';'
);

app.use(filemanagerMiddleware(config));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.static(path.resolve(__dirname, './static')));
app.listen(port, host, function(err) {
  if (err) {
    logger.error(err);
  }

  logger.info(`Server listening at http://${host}:${port}`);
});

process.on('exit', function() {
  logger.warn('Server has been stopped');
});
