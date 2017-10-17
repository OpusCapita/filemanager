'use strict';

let path = require('path');
let fs = require('fs');
let fse = require('fs-extra');

module.exports = function(app, fsRoot, userToken) {
  app.get('/files/*', (req, res) => {
    let relativePath = req.params[0] || '.';
    
  });
};
