const fs = require('fs');
const path = require('path');
const compression = require('compression');
const express = require('express');
const filemanagerMiddleware = require('@opuscapita/filemanager-server').middleware;
const logger = require('@opuscapita/filemanager-server').logger;
const env = require('./.env');

const config = {
  fsRoot: path.resolve(__dirname, './demo-fs'),
  rootName: 'Customization area'
};

const app = express();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || '3020';

fs.writeFileSync(
  path.resolve(__dirname, './static/env.js'),
  'window.env = ' + JSON.stringify(env) + ';'
);

app.use(compression());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

const baseUrl = process.env.BASE_URL;

console.log({ baseUrl });

app.route(baseUrl).use(filemanagerMiddleware(config));

app.route(baseUrl).use(express.static(path.resolve(__dirname, './static')));
app.listen(port, host, function(err) {
  if (err) {
    logger.error(err);
  }

  logger.info(`Server listening at http://${host}:${port}`);
});

process.on('exit', function() {
  logger.warn('Server has been stopped');
});
