'use strict';

const FS_ROOT = require('path').resolve(__dirname, '../../demo-fs');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || '3001';

let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let routes = require('./routes');

app.use(bodyParser.json());
routes(app, FS_ROOT);

const server = app.listen(PORT, HOST, function(err) {
  if(err) {
    console.log(err);
  }
  console.log(`Server listening at http://${HOST}:${PORT}`);
});
