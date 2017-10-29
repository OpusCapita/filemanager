'use strict';

const path = require('path');
const fs = require('fs-extra');
const multer = require('multer');

const getClientIp = require('../utils/get-client-ip');

const {
  checkTitle,
  id2path,
  stat2resource
} = require('./lib');

const {
  TYPE_FILE,
  TYPE_DIR
} = require('../../shared/constants');

let fsRoot;

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
        parentPath = path.resolve(fsRoot, '.' + id2path(parentId).replace(/\//g, path.sep));
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

module.exports = ({ options, req, res }) => {
  fsRoot = options.fsRoot;

  upload(req, res, err => {
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
        then(stat2resource(options, {
          dir: reqParentPath,
          basename: title
        })).
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
          then(stat2resource(options, {
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
  });
};
