import { expect } from 'chai';
let request = require('superagent');
// let baseUrl = '__env__baseURI__';
let baseUrl = 'localhost:3020';

let rootId = '';

let workChildDirId = '';
let workChildDirName = '';
let rootChildrenSize = '';

let workFileId = '';
let workFileName = '';
let workChildrenSize = '';

describe('Get resources metadata', () => {
  it('Get rootId', (done) => {
    request
      .get(`${baseUrl}/api/files`)
      .then(function(res) {
        expect(res.status).to.equal(200);

        let jsonData = res.body;
        expect(jsonData.type).to.equal('dir');
        expect(jsonData.capabilities.canListChildren).to.equal(true);
        expect(jsonData.capabilities.canAddChildren).to.equal(true);
        expect(jsonData.capabilities.canRemoveChildren).to.equal(true);
        expect(jsonData.capabilities.canDelete).to.equal(false);
        expect(jsonData.capabilities.canRename).to.equal(false);
        expect(jsonData.capabilities.canCopy).to.equal(false);
        expect(jsonData.capabilities.canEdit).to.equal(false);
        expect(jsonData.capabilities.canDownload).to.equal(false);

        rootId = jsonData.id;
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  it('Get root children', (done) => {
    request
      .get(`${baseUrl}/api/files/${rootId}/children`)
      .then(function(res) {
        let jsonData = res.body;

        expect(res.status).to.equal(200);

        for (let i = 0; i < jsonData.items.length; i++) {
          let item = jsonData.items[i];
          expect(item.type).to.equal('dir');
        }

        for (let i = 0; i < jsonData.items.length; i++) {
          let item = jsonData.items[i];
          expect(item.parentId).to.equal(rootId);
        }

        workChildDirId = jsonData.items[0].id;
        workChildDirName = jsonData.items[0].name;
        rootChildrenSize = jsonData.items.length;

        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  it('Get workChildDir children', (done) => {
    request
      .get(`${baseUrl}/api/files/${workChildDirId}/children`)
      .then(function(res) {
        let jsonData = res.body;

        expect(res.status).to.equal(200);

        for (let i = 0; i < jsonData.items.length; i++) {
          let item = jsonData.items[i];
          expect(item.type).to.equal('file');
        }

        for (let i = 0; i < jsonData.items.length; i++) {
          let item = jsonData.items[i];
          expect(item.parentId).to.equal(workChildDirId);
        }

        workFileId = jsonData.items[0].id;
        workFileName = jsonData.items[0].name;
        workChildrenSize = jsonData.items.length;

        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  it('Get children with incorrect id', (done) => {
    request
      .get(`${baseUrl}/api/files/${workChildDirId}${workChildDirId}/children`)
      .catch(function(err) {
        if (err && err.response && err.response.request.res) {
          expect(err.response.request.res.statusCode).to.equal(410);
          done();
        } else {
          done(err);
        }
      });
  });

  it('Get workChildDir metadata', (done) => {
    request
      .get(`${baseUrl}/api/files/${workChildDirId}`)
      .then(function(res) {
        let jsonData = res.body;

        expect(res.status).to.equal(200);
        expect(jsonData.id).to.equal(workChildDirId);
        expect(jsonData.name).to.equal(workChildDirName);
        expect(jsonData.type).to.equal("dir");

        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  it('Get workFile metadata', (done) => {
    request
      .get(`${baseUrl}/api/files/${workFileId}`)
      .then(function(res) {
        let jsonData = res.body;

        expect(res.status).to.equal(200);
        expect(jsonData.id).to.equal(workFileId);
        expect(jsonData.name).to.equal(workFileName);
        expect(jsonData.type).to.equal("file");

        done();
      })
      .catch(function(err) {
        done(err);
      });
  });
});

describe('Get resources metadata', () => {
  it('Rename dir', (done) => {
    let route = `${baseUrl}/api/files/${workChildDirId}`;
    let method = 'PATCH';
    let newName = 'changed dir';

    request(method, route).type('application/json').send({ name: newName }).
    then(function(res) {
      let jsonData = res.body;

      expect(res.status).to.equal(200);
      expect(jsonData.parentId).to.equal(rootId);
      expect(jsonData.type).to.equal("dir");

      done();
    }).
    catch((error) => {
      console.error(`Filemanager. renameResource(${id})`, error);
      onFail()
    });

    done();
  })
});

// res.body, res.headers, res.status
// err.message, err.response
