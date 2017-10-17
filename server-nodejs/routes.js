'use strict';

let path = require('path');
let fs = require('fs');
let fse = require('fs-extra');

module.exports = function(app, fsRoot, userToken) {
  app.get('/config', (req, res) => {
    // temporary solution. Config should be placed in database;
    let configPath = path.resolve(__dirname, './config/config.js');
    res.sendFile(configPath);
  });

  app.get('/files/*', (req, res) => {
    let relativePath = req.params[0] || '.';

  });
};
