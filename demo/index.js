let path = require('path');
let express = require('express');
let filemanager = require('@opuscapita/filemanager-server');

filemanager.run({
  fsRoot: path.resolve(__dirname, './demo-fs'),
  rootTitle: 'Customization area',
  port: process.env.PORT || '3020',
  host: process.env.HOST || 'localhost'
});
