'use strict';

const base64url = require('base64url');

function encode(path) {
  if (typeof path !== 'string') {
    throw new Error('Only strings can be base64-encoded');
  }

  return base64url(path);
}

function decode(id) {
  if (typeof id !== 'string' || !id) {
    throw new Error('Invalid id');
  }

  return base64url.decode(id);
}
window.id = ({ encode, decode })
module.exports = {
  encode,
  decode
};
