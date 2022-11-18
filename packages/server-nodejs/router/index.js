'use strict';

const helmet = require('helmet');
const zip = require('express-easy-zip'); // 'node-archiver', 'zipstream' or 'easyzip'  may be used instead.
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const path = require('path');
const edward = require('edward');

const sessionAge = 24 * (60 * 60 * 1000); //24h

const {
  id2path,
  handleError
} = require('./lib');

module.exports = config => {
  const router = express.Router();

  router.use(session({secret: 'top secret', resave: false, saveUninitialized: false, cookie: { maxAge: sessionAge }}));

  router.use(function(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET,POST,HEAD,OPTIONS,PUT,PATCH,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  router.use(helmet.noCache());
  router.use(zip());
  router.use(bodyParser.json());

  router.use(edward({
    root: '/', // default
    online: true, // default
    diff: true, // default
    zip: true, // default
    dropbox: false, // optional
    dropboxToken: 'token', // optional
  }));

  //https://stackoverflow.com/questions/6563885/how-do-i-get-a-list-of-connected-sockets-clients-with-socket-io
  if (config.edsocket) {
    const edSocket = edward.listen(config.edsocket);  
  }
  
  // edSocket.on('connection', () => {
  //   console.log(`edward socket connected!!!`);
  //   const iterator = config.edsocket.of("/edward").sockets.keys();

  //   for (const value of iterator) {
  //     console.log(value);
  //     var socket = config.edsocket.of("/edward").sockets.get(value);
  //     socket.emit('file', 'FileName', 'AlataBalata:' + value);
  //   }

  //   console.log('XXXX:' + config.edsocket.engine.clientsCount);
  //   //io.sockets.sockets.get(socketId);
  //   //edSocket.emit('file', 'FileName', 'AlataBalata');
  // });  

  let reqPath;

  const connect = (moduleLocation, getArgs) => (req, res, next) => {
    require(moduleLocation)(Object.assign(
      {
        config,
        req,
        res,
        next,
        handleError: handleError({ config, req, res })
      },
      getArgs ? getArgs() : {}
    ));
  };

  router.param('id', function(req, res, next, id) {
    try {
      reqPath = id2path(id);
    } catch (err) {
      return handleError({ config, req, res })(Object.assign(
        err,
        { httpCode: 400 }
      ));
    }

    return next();
  });

  router.route('/files/:id/children').
    get(connect('./listChildren', _ => ({ path: reqPath })));

  router.route('/files/:id/search').
    get(connect('./search', _ => ({ path: reqPath })));

  router.route('/files/:id').
    get(connect('./statResource', _ => ({ path: reqPath }))).
    patch(connect('./renameCopyMove', _ => ({ path: reqPath }))).
    delete(connect('./remove', _ => ({ path: reqPath })));

  router.route('/files').
    get(connect('./statResource', _ => ({ path: path.sep }))).
    post(connect('./uploadOrCreate'));

  router.route('/download').
    get(connect('./download'));

  router.route('/authentication/*').
    get(connect('./authentication', _ => ({}))).
    post(connect('./authentication', _ => ({})));

  router.use((err, req, res, next) => handleError({ config, req, res })(err));
  return router;
};
