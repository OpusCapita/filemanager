'use strict';

const path = require('path');
const fs = require('fs-extra');
const multer = require('multer');
const zip = require('express-easy-zip'); // 'node-archiver', 'zipstream' or 'easyzip'  may be used instead.

const getClientIp = require('../utils/get-client-ip');

const {
  encode: path2id,
  decode
} = require('../utils/id');

const {
  TYPE_FILE,
  TYPE_DIR
} = require('../../shared/constants');

const UNKNOWN_RESOURCE_TYPE_ERROR = 'Unknown resource type';

const id2path = id => {
  const userPath = decode(id);

  if (!userPath || typeof userPath !== 'string') {
    throw new Error('Invalid path, it must be non-empty string');
  }

  if (userPath.charAt(0) !== '/') {
    throw new Error('Invalid path, it must start with "/"');
  }

  if (/.\/$/.test(userPath)) {
    throw new Error('Invalid path, it must not end with "/"');
  }

  if (~userPath.indexOf('\\')) {
    throw new Error('Invalid path, it must not contain "\\"');
  }

  if (~userPath.indexOf('//')) {
    throw new Error('Invalid path, it must not contain two "/" in a row');
  }

  return userPath;
}

const checkTitle = title => {
  if (!title) {
    throw new Error('Title must not be empty');
  }

  if (typeof title !== 'string') {
    throw new Error('Title must be a string');
  }

  if (~title.indexOf(path.sep) || ~title.indexOf('/')) {
    throw new Error('Unable to create title with forbidden symbols');
  }

  return title;
}

module.exports = (app, options) => {
  app.use(zip());

  const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        const { title, parentId, type } = req.body;

        if (type !== TYPE_FILE) {
          cb(new Error('type ${type} conflicts with files field requested by ${getClientIp(req)}'));
          return;
        }

        if (title) {
          cb(new Error('title ${title} conflicts with files field requested by ${getClientIp(req)}'));
          return;
        }

        let parentPath;

        try {
          parentPath = path.resolve(options.fsRoot, '.' + id2path(parentId).replace(/\//g, path.sep));
        } catch (err) {
          cb(err);
          return;
        }

        fs.access(parentPath).
          then(_ => cb(null, parentPath)).
          catch(_ => cb('Parent folder does not exist'));
      },
      filename(req, file, cb) {
        try {
          checkTitle(file.originalname);
        } catch (err) {
          cb(err);
          return;
        }

        cb(null, file.originalname);
      }
    })
  }).
   array('files');

  const stat2resource = pathInfo => stat => {
    let userPath, userParent, userBasename; // For root, userPath === '/', userParent and userBasename are falsy.

    if (typeof pathInfo === 'string') {
      userPath = pathInfo;

      if (userPath !== '/') {
        userParent = path.dirname(userPath);
        userBasename = path.basename(userPath);
      }
    } else {
      userParent = pathInfo.dir;
      userBasename = pathInfo.basename;
      userPath = userParent ?
        (userParent === '/' ? '/' : userParent + '/') + userBasename :
        '/';
    }

    const id = path2id(userPath);

    const resource = {
      id,
      title: userBasename || options.rootTitle,
      createDate: stat.birthtime,
      modifyDate: stat.mtime,
      capabilities: {
        canListChildren: true,
        canAddChildren: true,
        canRemoveChildren: true,
        canDelete: !!userParent,
        canDownload: stat.isFile() // Only files can be downloaded
      }
    };

    if (userParent) {
      resource.parentId = path2id(userParent);
    }

    if (stat.isDirectory()) {
      resource.type = TYPE_DIR;
    } else if (stat.isFile()) {
      resource.type = TYPE_FILE;
      resource.size = stat.size;
      // TBD: in "downloadUrl" Google includes protocol, ip, port, etc.
      // TBD: What the need if dir and files selection download is constructed by a client anyway.
      resource.downloadUrl = `/api/download?items=${id}`;
    } else {
      throw new Error(UNKNOWN_RESOURCE_TYPE_ERROR);
    }

    return resource;
  }

  app.get('/api/files/:id/children', (req, res) => {
    const id = req.params.id;
    let reqPath;

    try {
      reqPath = id2path(id);
    } catch (err) {
      options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
      res.status(204).end();
      return;
    }

    const absPath = path.resolve(options.fsRoot, '.' + reqPath.replace(/\//g, path.sep));
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
          then(items =>
            items.sort((itemA, itemB) =>
              (itemB.type === TYPE_DIR) - (itemA.type === TYPE_DIR) || itemA.title.localeCompare(itemB.title)
              // TODO: add user locale as 2nd argument to the above localeCompare() function.
            )).
          then(items => res.json({ items }))
      ).
      catch(err => {
        options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
        res.status(204).end();
      });
  });

  app.get('/api/files/:id', (req, res) => {
    const id = req.params.id;
    let reqPath;

    try {
      reqPath = id2path(id);
    } catch (err) {
      options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
      res.status(204).end();
      return;
    }

    const absPath = path.resolve(options.fsRoot, '.' + reqPath.replace(/\//g, path.sep));
    options.logger.info(`Stat for ${absPath} requested by ${getClientIp(req)}`);

    fs.stat(absPath).
      then(stat2resource(reqPath)).
      then(resource => res.json(resource)).
      catch(err => {
        options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
        res.status(204).end();
      });
  });

  app.get('/api/files', (req, res) => {
    const absPath = path.resolve(options.fsRoot);
    options.logger.info(`Stat for ${absPath} requested by ${getClientIp(req)}`);

    fs.stat(absPath).
      then(stat2resource('/')).
      then(resource => res.json(resource)).
      catch(err => {
        options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
        res.status(204).end();
      });
  });

  app.delete('/api/files/:id', (req, res) => {
    const id = req.params.id;
    let reqPath;

    try {
      reqPath = id2path(id);
    } catch (err) {
      options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
      res.status(204).end();
      return;
    }

    if (reqPath === '/') {
      options.logger.error(`User root must never be deleted, as requested by ${getClientIp(req)}`);
      res.status(204).end();
      return;
    }

    const absPath = path.resolve(options.fsRoot, '.' + reqPath.replace(/\//g, path.sep));
    options.logger.info(`Delete ${absPath} requested by ${getClientIp(req)}`);

    fs.remove(absPath).
      then(_ => res.status(200).end()).
      catch(err => {
        options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
        res.status(204).end();
      });
  });

  app.post('/api/files', (req, res) => upload(req, res, err => {
    if (err) {
      options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
      res.status(204).end();
      return;
    }

    const { title, parentId, type } = req.body;

    if (type === TYPE_DIR) {
      try {
        checkTitle(title);
      } catch (err) {
        options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
        res.status(204).end();
        return;
      }

      let reqParentPath;

      try {
        reqParentPath = id2path(parentId);
      } catch (err) {
        options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
        res.status(204).end();
        return;
      }

      const parentPath = path.resolve(options.fsRoot, '.' + reqParentPath.replace(/\//g, path.sep));
      const dirPath = parentPath + path.sep + title;
      options.logger.info(`Create dir ${dirPath} requested by ${getClientIp(req)}`);

      fs.access(parentPath). // Check whether parent exists.
        then(_ => fs.ensureDir(dirPath)).
        then(_ => fs.stat(dirPath)).
        then(stat2resource({ dir: reqParentPath, basename: title })).
        then(resource => res.json(resource)).
        catch(err => {
          options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
          res.status(204).end();
        });
    } else if (type === TYPE_FILE) {
      if (title) {
        options.logger.error(`ERROR: title ${title} conflicts with type requested by ${getClientIp(req)}`);
        res.status(204).end();
        return;
      }

      options.logger.info(`Upload ${req.files.map(({ path }) => path)} requested by ${getClientIp(req)}`);

      Promise.all(req.files.map(({ path, filename }) =>
        fs.stat(path).
          then(stat2resource({
            dir: parentId,
            basename: filename
          }))
      )).
        then(items => res.json(items)).
        catch(err => {
          options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
          res.status(204).end();
        })
    } else {
      options.logger.error(`ERROR: unable to create title of invalid type ${type} requested by ${getClientIp(req)}`);
      res.status(204).end();
    }
  }));

  app.get('/api/download', (req, res) => {
    const ids = Array.isArray(req.query.items) ? req.query.items : [req.query.items];
    let reqPaths;

    try {
      reqPaths = ids.map(id => id2path(id));
    } catch (err) {
      options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
      res.status(204).end();
      return;
    }

    const absPaths = reqPaths.map(reqPath => path.resolve(options.fsRoot, '.' + reqPath.replace(/\//g, path.sep)));
    options.logger.info(`Download ${absPaths} requested by ${getClientIp(req)}`);

    if (absPaths.length === 1) {
      fs.stat(absPaths[0]).
        then(stat => {
          if (stat.isDirectory()) {
            res.zip({
              files: [{
                path: absPaths[0],
                name: absPaths[0] === options.fsRoot ? options.rootTitle : path.basename(absPaths[0])
              }],
              filename: (absPaths[0] === options.fsRoot ? options.rootTitle : path.basename(absPaths[0])) + '.zip'
            });
          } else {
            res.download(absPaths[0]);
          }
        }).
        catch(err => {
          options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
          res.status(204).end();
        });

      return;
    }

    const parentPath = path.dirname(absPaths[0]);

    if (absPaths.slice(1).some(absPath => path.dirname(absPath) !== parentPath)) {
      options.logger.error(`Error processing request by ${getClientIp(req)}: all items must be from one folder`);
      res.status(204).end();
      return;
    }

    res.zip({
      files: absPaths.map(absPath => ({ // TODO: handle situation when none of absPaths exists.
        path: absPath,
        name: path.basename(absPath)
      })),
      filename: (parentPath === options.fsRoot ? options.rootTitle : path.basename(parentPath)) + '.zip'
    }).
      catch(err => {
        options.logger.error(`Error processing request by ${getClientIp(req)}: ${err}`);
        res.status(204).end();
      });
  });
}
