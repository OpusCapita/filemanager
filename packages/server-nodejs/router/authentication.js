'use strict';

const path = require('path');
const fs = require('fs-extra');
const getClientIp = require('../utils/get-client-ip');
let fails;
const LOCK_MS = 15 * 60 * 1000;


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
      const lockFile = config.loginLockoutStateFile;
      try { fails = fs.readJsonSync(lockFile); } catch (err) { fails = {}; }
      const saveFails = () => {
        try {
          fs.writeJsonSync(lockFile + '.tmp', fails);
          fs.moveSync(lockFile + '.tmp', lockFile, { overwrite: true });
        } catch (err) { /* nicht schreibbar */ }
      };

      let { username, password } = req.body;
      username = Buffer.from(username,'base64').toString();
      password = Buffer.from(password,'base64').toString();
//      console.log(`username:${username} pasword:${password}`);

      const now = Date.now();
      const rec = fails[username] || { count: 0, until: 0, last: 0 };
      if (rec.until > now) {
        res.status(429).json({ retryAfter: Math.ceil((rec.until - now) / 1000) });
        return;
      }

      const user = config.users ? config.users.find( user => (user.username === username) && (user.password === password)) : false;

      if ( user ) {
//        console.log(`200 username:${username} password:${password}`);
        if (fails[username]) { delete fails[username]; saveFails(); }
        req.session.user = {username: username, readOnly: user.readOnly};
        res.json({username: user.username});
        res.status(200).end();
      } else if (config.users) {
        if (!config.users.some(u => u.username === username)) { res.status(419).end(); return; }
        config.logger.warn(`Failed sign-in for user "${username}" from ${getClientIp(req)}`);
        rec.count = (now - (rec.last || 0) > LOCK_MS) ? 1 : rec.count + 1;
        rec.last = now;
        if (rec.count >= 3) { rec.count = 0; rec.until = now + LOCK_MS; }
        fails[username] = rec;
        saveFails();
        if (rec.until > now) {
          res.status(429).json({ retryAfter: LOCK_MS / 1000 });
          return;
        }
        res.status(419).end();
      }
      else {
        res.status(200).json({ username: '' });
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
