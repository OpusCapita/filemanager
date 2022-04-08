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
  let subreq = req.path.replace('authentication', '');
  subreq = subreq.replaceAll('/', '');

  config.logger.info(`Authentication request "${subreq}" requested by ${getClientIp(req)}`);

  switch(subreq) {
    case 'signin':
      const { username, password } = req.body;
      const user = config.users?.find( user => (user.username === username) && (user.password === password));
      if ( user ) {
        console.log(`200 username:${username} password:${password}`);
        req.session.user = {username: username, readOnly: user.readOnly};
        res.json({username: user.username});
        res.status(200).end();
      } else {
        //https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate
        //https://stackoverflow.com/questions/23616371/basic-http-authentication-with-node-and-express-4
        if (config.users) {
          console.log(`401 username:${username} password:${password}`);
          res.set('WWW-Authenticate', 'Basic');
          res.status(401).end();
        } else {
          res.status(200).end();
        }
      }
      break;

    case 'signout':
      req.session.destroy();
      res.status(200).end();
      break;

    case 'hassignedin':
      if (!config.users) {
        res.status(200).end();
      } else if (req.session.user) {
        res.json({username: req.session.user.username});
        res.status(200).end();
      } else {
        res.set('WWW-Authenticate', 'Basic');
        res.status(401).end();
      }
      break;

    default:
      return handleError(Object.assign(
        new Error(`Resource not found`),
        { httpCode: 404 }
      ));
  }
};
