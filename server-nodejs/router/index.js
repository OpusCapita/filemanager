'use strict';

const zip = require('express-easy-zip'); // 'node-archiver', 'zipstream' or 'easyzip'  may be used instead.
const bodyParser = require('body-parser');
const express = require('express');
let router = express.Router();

module.exports = (options) => {
  router.use(zip());
  router.use(bodyParser.json());

  const connect = moduleLocation => (req, res, next) => {
    require(moduleLocation)({ options, req, res, next });
  };

  router.get('/api/files/:id/children', connect('./listChildren'));

  router.get('/api/files/:id', connect('./statResource'));
  router.delete('/api/files/:id', connect('./remove'));

  router.get('/api/files', connect('./statResource'));
  router.post('/api/files', connect('./uploadOrCreate'));

  router.get('/api/download', connect('./download'));

  return router;
};
