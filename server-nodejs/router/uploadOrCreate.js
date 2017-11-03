'use strict';

const path = require('path');
const fs = require('fs-extra');
const multer = require('multer');

const getClientIp = require('../utils/get-client-ip');

const {
  checkName,
  id2path,
  stat2resource
} = require('./lib');

const {
  TYPE_FILE,
  TYPE_DIR
} = require('../constants');

let fsRoot;

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      const { name, parentId, type } = req.body;

      if (type !== TYPE_FILE) {
        cb(new Error('type ${type} conflicts with files field requested by ${getClientIp(req)}'));
        return;
      }

      if (name) {
        cb(new Error('name ${name} conflicts with files field requested by ${getClientIp(req)}'));
        return;
      }

      let parentPath;

      try {
        parentPath = path.join(fsRoot, id2path(parentId));
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
        checkName(file.originalname);
      } catch (err) {
        cb(err);
        return;
      }

      cb(null, file.originalname);
    }
  })
}).
  array('files');

module.exports = ({ options, req, res, handleError }) => {
  fsRoot = options.fsRoot;

  upload(req, res, err => {
    if (err) {
      return handleError(err);
    }

    const { name, parentId, type } = req.body;
    let reqParentPath;

    try {
      reqParentPath = id2path(parentId);
    } catch (err) {
      return handleError(Object.assign(
        err,
        { httpCode: 400 }
      ));
    }

    if (type === TYPE_DIR) {
      try {
        checkName(name);
      } catch (err) {
        return handleError(Object.assign(
          err,
          { httpCode: 400 }
        ));
      }

      const parentPath = path.join(options.fsRoot, reqParentPath);
      const dirPath = path.join(parentPath, name);
      options.logger.info(`Create dir ${dirPath} requested by ${getClientIp(req)}`);

      return fs.access(parentPath). // Check whether parent exists.
        then(_ => fs.ensureDir(dirPath)).
        then(_ => fs.stat(dirPath)).
        then(stat2resource(options, {
          dir: reqParentPath,
          basename: name
        })).
        then(resource => res.json(resource)).
        catch(handleError);
    } else if (type === TYPE_FILE) {
      if (name) {
        return handleError(Object.assign(
          new Error(`name ${name} conflicts with type`),
          { httpCode: 400 }
        ));
      }

      options.logger.info(`Upload ${req.files.map(({ path }) => path)} requested by ${getClientIp(req)}`);

      return Promise.all(req.files.map(({ path, filename }) =>
        fs.stat(path).
          then(stat2resource(options, {
            dir: reqParentPath,
            basename: filename
          }))
      )).
        then(items => res.json(items)).
        catch(handleError);
    } else {
      return handleError(Object.assign(
        new Error(`Unable to create name of invalid type ${type}`),
        { httpCode: 400 }
      ));
    }
  });
};
