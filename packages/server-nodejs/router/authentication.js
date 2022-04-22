'use strict';

const path = require('path');
const fs = require('fs-extra');
const getClientIp = require('../utils/get-client-ip');

module.exports = ({
  config,
  req,
  res,
  handleError
}) => {
  let subreq = req.path.replace('/authentication/', '');
  subreq = subreq.replace('/', '');

  config.logger.info(`Authentication request "${subreq}" requested by ${getClientIp(req)}`);

  switch(subreq) {
    case 'signin':
      let { username, password } = req.body;
      username = Buffer.from(username,'base64').toString();
      password = Buffer.from(password,'base64').toString();
      console.log(`username:${username} pasword:${password}`);
      const user = config.users ? config.users.find( user => (user.username === username) && (user.password === password)) : false;
      if ( user ) {
        console.log(`200 username:${username} password:${password}`);
        req.session.user = {username: username, readOnly: user.readOnly};
        res.json({username: user.username});
        res.status(200).end();
      } else {
        //https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate
        //https://stackoverflow.com/questions/23616371/basic-http-authentication-with-node-and-express-4
        if (config.users) {
          console.log(`419 username:${username} password:${password}`);
          res.status(419).end();
        } else {
          res.json({username: ''});
          res.status(200).end();
        }
      }
      break;

    case 'signout':
      req.session.destroy();
      res.status(200).end();
      break;

    case 'hassignedin':
      if (config.users) {
        if ( req.session.user ) {
          res.json({username: req.session.user.username});
          res.status(200).end();
        } else {
          res.status(419).end();        
        }       
      } else {
        res.json({username: ''});
        res.status(200).end();        
      }
      break;

    default:
      return handleError(Object.assign(
        new Error(`Resource not found`),
        { httpCode: 404 }
      ));
  }
};
