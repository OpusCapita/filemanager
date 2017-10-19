'use strict';

let base64url = require('base64url');

function encode(path) {
  let result = encodeURIComponent(base64url(path));
  console.log('path:', path);
  console.log('encoded:', result);
  return result;
};

function decode(id) {
  let result = decodeURIComponent(base64url.decode(id));
  console.log('id:', id);
  console.log('decoded:', result);
  return result;
};

module.exports = {
  encode,
  decode
};
