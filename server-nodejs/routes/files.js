'use strict';

const path = require('path');
const fs = require('fs-extra');

const getClientIp = require('../utils/get-client-ip');

const {
  encode: path2id,
  decode: id2path
} = require('../utils/id');

const UNKNOWN_RESOURCE_TYPE_ERROR = 'Unknown resource type';

module.exports = (app, options) => {
  const stat2resource = pathInfo => stat => {
    let userPath, userParent, userBasename;

    if (typeof pathInfo === 'string') {
      userPath = pathInfo;

      if (userPath !== '/') {
        userParent = path.dirname(userPath);
        userBasename = path.basename(userPath);
      }
    } else {
      userParent = pathInfo.dir;
      userBasename = pathInfo.basename;
      userPath = (userParent === '/' ? '/' : userParent + '/') + userBasename;
    }

    const resource = {
      id: path2id(userPath),
      title: userBasename || options.rootTitle,
      createDate: stat.birthtime,
      modifyDate: stat.mtime
    };

    if (userParent) {
      resource.parentId = path2id(userParent);
    }

    if (stat.isDirectory()) {
      resource.type = 'dir';
    } else if (stat.isFile()) {
      resource.type = 'file';
      resource.size = stat.size;
    } else {
      throw new Error(UNKNOWN_RESOURCE_TYPE_ERROR);
    }

    console.log('*** stat2resource returns', resource);
    return resource;
  }

  app.get('/api/files/:id/children', (req, res) => {
    const id = req.params.id;
    const requestedPath = id2path(id);
    const absolutePath = path.resolve(options.fsRoot, '.' + requestedPath.split('/').join(path.sep));
    options.logger.info(`Children for ${absolutePath} requested by ${getClientIp(req)}`);

    fs.readdir(absolutePath).
      then(basenames =>
        Promise.all(basenames.map(basename => fs.stat(absolutePath + path.sep + basename))).
          then(stats => stats.reduce(
            (rez, stat, i) => {
              try {
                rez.push(stat2resource({ dir: requestedPath, basename: basenames[i] })(stat));
              } catch (err) {
                if (err.message !== UNKNOWN_RESOURCE_TYPE_ERROR) {
                  throw err;
                }
              }

              return rez;
            },
            []
          )).
          then(rez => res.json(rez)).
          catch(err => {
            options.logger.error(err);
            res.status(204).end();
          })
      ).
      catch(err => {
        options.logger.error(err);
        res.status(204).end();
      });
  });

  app.get('/api/files/:id', (req, res) => {
    const id = req.params.id;
    const requestedPath = id2path(id);
    const absolutePath = path.resolve(options.fsRoot, '.' + requestedPath.split('/').join(path.sep));
    options.logger.info(`Stat for ${absolutePath} requested by ${getClientIp(req)}`);

    fs.stat(absolutePath).
      then(stat2resource(requestedPath)).
      then(rez => res.json(rez)).
      catch(err => {
        options.logger.error(err);
        res.status(204).end();
      });
  });

  app.get('/api/files', (req, res) => {
    const absolutePath = path.resolve(options.fsRoot);
    options.logger.info(`Stat for ${absolutePath} requested by ${getClientIp(req)}`);

    fs.stat(absolutePath).
      then(stat2resource('/')).
      then(rez => res.json(rez)).
      catch(err => {
        options.logger.error(err);
        res.status(204).end();
      });
  });
}
