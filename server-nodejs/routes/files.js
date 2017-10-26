'use strict';

const path = require('path');
const fs = require('fs-extra');
const multer = require('multer')

const getClientIp = require('../utils/get-client-ip');

const {
  encode: path2id,
  decode: id2path
} = require('../utils/id');

const UNKNOWN_RESOURCE_TYPE_ERROR = 'Unknown resource type';

module.exports = (app, options) => {
  const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        const { title, parentId, type } = req.body;

        if (type !== file) {
          cb(new Error('type ${type} conflicts with files field requested by ${getClientIp(req)}'));
          return;
        }

        if (title) {
          cb(new Error('title ${title} conflicts with files field requested by ${getClientIp(req)}'));
          return;
        }

        const reqParentPath = id2path(parentId);
        const absPath = path.resolve(options.fsRoot, '.' + reqParentPath.split('/').join(path.sep));
        cb(null, absPath);
      },
      filename(req, file, cb) {
        cb(null, file.originalname);
      }
    })
  });

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

    return resource;
  }

  app.get('/api/files/:id/children', (req, res) => {
    const id = req.params.id;
    const reqPath = id2path(id);
    const absPath = path.resolve(options.fsRoot, '.' + reqPath.split('/').join(path.sep));
    options.logger.info(`Children for ${absPath} requested by ${getClientIp(req)}`);

    fs.readdir(absPath).
      then(basenames =>
        Promise.all(basenames.map(basename => fs.stat(absPath + path.sep + basename))).
          then(stats => stats.reduce(
            (rez, stat, i) => {
              try {
                rez.push(stat2resource({ dir: reqPath, basename: basenames[i] })(stat));
              } catch (err) {
                if (err.message !== UNKNOWN_RESOURCE_TYPE_ERROR) {
                  throw err;
                }
              }

              return rez;
            },
            []
          )).
          then(rez => res.json(rez))
      ).
      catch(err => {
        options.logger.error(err);
        res.status(204).end();
      });
  });

  app.get('/api/files/:id', (req, res) => {
    const id = req.params.id;
    const reqPath = id2path(id);
    const absPath = path.resolve(options.fsRoot, '.' + reqPath.split('/').join(path.sep));
    options.logger.info(`Stat for ${absPath} requested by ${getClientIp(req)}`);

    fs.stat(absPath).
      then(stat2resource(reqPath)).
      then(rez => res.json(rez)).
      catch(err => {
        options.logger.error(err);
        res.status(204).end();
      });
  });

  app.get('/api/files', (req, res) => {
    const absPath = path.resolve(options.fsRoot);
    options.logger.info(`Stat for ${absPath} requested by ${getClientIp(req)}`);

    fs.stat(absPath).
      then(stat2resource('/')).
      then(rez => res.json(rez)).
      catch(err => {
        options.logger.error(err);
        res.status(204).end();
      });
  });

  app.delete('/api/files/:id', (req, res) => {
    const id = req.params.id;
    const reqPath = id2path(id);
    const absPath = path.resolve(options.fsRoot, '.' + reqPath.split('/').join(path.sep));
    options.logger.info(`Delete ${absPath} requested by ${getClientIp(req)}`);

    fs.remove(absPath).
      then(_ => res.status(200).end()).
      catch(err => {
        options.logger.error(err);
        res.status(204).end();
      });
  });

  app.post('/api/files', upload.array('files'), (req, res) => {
    const { title, parentId, type } = req.body;

    if (type === 'dir') {
      if (!title) {
        options.logger.error(`ERROR: unable to create empty title requested by ${getClientIp(req)}`);
        res.status(204).end();
        return;
      }

      if (~title.indexOf(path.sep)) {
        options.logger.error(`ERROR: unable to create title with forbidden symbols requested by ${getClientIp(req)}`);
        res.status(204).end();
        return;
      }

      const reqParentPath = id2path(parentId);
      const absPath = path.resolve(options.fsRoot, '.' + reqParentPath.split('/').join(path.sep) + path.sep + title);
      options.logger.info(`Create dir ${absPath} requested by ${getClientIp(req)}`);

      // fs.access makes sure that parent exists.
      fs.access(path.resolve(options.fsRoot, '.' + reqParentPath.split('/').join(path.sep))).
        then(_ => fs.ensureDir(absPath)).
        then(_ => fs.stat(absPath)).
        then(stat2resource({ dir: reqParentPath, basename: title })).
        then(rez => res.json(rez)).
        catch(err => {
          options.logger.error(err);
          res.status(204).end();
        });
    } else if (type === 'file') {
      if (title) {
        options.logger.error(`ERROR: title ${title} conflicts with type requested by ${getClientIp(req)}`);
        res.status(204).end();
        return;
      }

      Promise.all(req.files.map(({ path, filename }) =>
        fs.stat(path).
          then(stat2resource({
            dir: parentId,
            basename: filename
          }))
      )).
        then(rez => res.json(rez)).
        catch(err => {
          options.logger.error(err);
          res.status(204).end();
        })
    } else {
      options.logger.error(`ERROR: unable to create title of unknown type ${type} requested by ${getClientIp(req)}`);
      res.status(204).end();
    }
  });
}
