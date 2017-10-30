'use strict';

const zip = require('express-easy-zip'); // 'node-archiver', 'zipstream' or 'easyzip'  may be used instead.

module.exports = (app, options) => {
  app.use(zip());

  const connect = moduleLocation => (req, res, next) => {
    require(moduleLocation)({ options, req, res, next });
  };

  app.route('/api/files/:id/children').
    get(connect('./listChildren'));

  app.route('/api/files/:id').
    get(connect('./statResource')).
    delete(connect('./remove'));

  app.route('/api/files').
    get(connect('./statResource')).
    post(connect('./uploadOrCreate'));

  app.route('/api/download').
    get(connect('./download'));

  app.route('/api/client-config').
    get(connect('./client-config'));
};
