'use strict';

const base64url = require('base64url');

function encode(path) {
  const result = base64url(path);
  console.log('path:', path);
  console.log('encoded:', result);
  return result;
};

function decode(id) {
  const result = base64url.decode(id);
  console.log('id:', id);
  console.log('decoded:', result);
  return result;
};

module.exports = {
  encode,
  decode
};
