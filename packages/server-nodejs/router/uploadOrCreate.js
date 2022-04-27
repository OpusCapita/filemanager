'use strict';

const path = require('path');
const fs = require('fs-extra');
const multer = require('multer');

const getClientIp = require('../utils/get-client-ip');

const {
  checkName,
  id2path,
  getResource,
  isReadOnly
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
        return cb(Object.assign(
          new Error(`type ${type} conflicts with files field requested by ${getClientIp(req)}`),
          { httpCode: 400 }
        ));
      }

      if (name) {
        return cb(Object.assign(
          new Error(`name ${name} conflicts with files field requested by ${getClientIp(req)}`),
          { httpCode: 400 }
        ));
      }

      let parentPath;

      try {
        parentPath = path.join(fsRoot, id2path(parentId));
      } catch (err) {
        return cb(Object.assign(
          err,
          { httpCode: 400 }
        ));
      }

      return fs.access(parentPath).
        then(_ => cb(null, parentPath)).
        catch(cb);
    },
    filename(req, file, cb) {
      const { parentId } = req.body;

      try {
        checkName(file.originalname);
      } catch (err) {
        return cb(Object.assign(
          err,
          { httpCode: 400 }
        ));
      }

      let parentPath;

      try {
        parentPath = path.join(fsRoot, id2path(parentId));
      } catch (err) {
        return cb(Object.assign(
          err,
          { httpCode: 400 }
        ));
      }

      return fs.readdir(parentPath).
        then(basenames => {
          let basename = file.originalname;

          if (basenames.includes(basename)) {
            const { name, ext } = path.parse(basename);
            let suffix = 1;

            do {
              basename = `${name} (${suffix++})${ext}`;
            } while (basenames.includes(basename));
          }

          cb(null, basename);
        }).
        catch(cb);
    }
  })
}).
  array('files');

module.exports = ({ config, req, res, handleError }) => {
  if (config.users && req.session.user === undefined) {
    return handleError(Object.assign(
      new Error(`Session expired.`),
      { httpCode: 419 }
    ));    
  }
    
  if (isReadOnly(config, req.session)) {
    return handleError(Object.assign(
      new Error(`File Manager is in read-only mode`),
      { httpCode: 403 }
    ));
  }

  fsRoot = config.fsRoot;

  return upload(req, res, err => {
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

      const parentPath = path.join(config.fsRoot, reqParentPath);
      const dirPath = path.join(parentPath, name);
      config.logger.info(`Create dir ${dirPath} requested by ${getClientIp(req)}`);

      return fs.access(parentPath). // Check whether parent exists.
        then(_ => fs.ensureDir(dirPath)).
        then(_ => getResource({
          config,
          session: req.session,
          parent: reqParentPath,
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

      config.logger.info(`Upload ${req.files.map(({ path }) => path)} requested by ${getClientIp(req)}`);

      return Promise.all(
        req.files.map(({ filename }) => getResource({
          config,
          session: req.session,
          parent: reqParentPath,
          basename: filename
        }))
      ).
        then(resources => res.json(resources)).
        catch(handleError);
    } else {
      return handleError(Object.assign(
        new Error(`Unable to create name of invalid type ${type}`),
        { httpCode: 400 }
      ));
    }
  });
};
