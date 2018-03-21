import { expect } from 'chai';
import fs from 'fs';
let request = require('superagent');
const base64url = require('base64url');
const {
  id2path
} = require('../router/lib');

let baseUrl = 'localhost:3020';

let rootId = '';

let workChildDirId = '';
let workChildDirName = '';
let workChildDirId1 = ''; // eslint-disable-line
let workChildDirName1 = ''; // eslint-disable-line
let rootChildrenSize = 0;

let workFileId = '';
let workFileName = '';
let workFileId1 = ''; // eslint-disable-line
let workFileName1 = ''; // eslint-disable-line
let workChildrenSize = 0;

let changedWorkChildDirId = '';

let changedFileId = '';

let newDirName = '';
let newDirId = '';
let newDirSize = 0;

let newGrandchildName1 = '';
let newGrandchildId1 = '';
let newGrandchildName2 = '';
let newGrandchildId2 = '';
let newGrandchildName3 = '';
let newGrandchildId3 = '';

let copiedFileName = '';
let copiedFileId = '';
let copiedFileId3 = '';

/**
 * Function creates incorrect resource's id from correct directory id and nonexistent name
 *
 * @param {string} dirId - correct directory's id
 * @param {string} addName - nonexistent name
 * @returns {string}
 */
function createIncorrectId(dirId, addName) {
  return base64url(`${id2path(dirId)}/${addName}`);
}

describe('Get resources metadata', () => {
  it('Get rootId', (done) => {
    request.
      get(`${baseUrl}/api/files`).
      then(res => {
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
      }).
      catch(err => {
        done(err);
      });
  });

  it('Get root children', (done) => {
    request.
      get(`${baseUrl}/api/files/${rootId}/children`).
      query({ action: 'edit', city: 'London' }). // query string
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);

        for (let i = 0; i < jsonData.items.length; i++) {
          let item = jsonData.items[i];
          expect(item.type).to.equal('dir');
          expect(item.parentId).to.equal(rootId);
        }

        workChildDirId = jsonData.items[0].id;
        workChildDirName = jsonData.items[0].name;
        rootChildrenSize = jsonData.items.length;

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Get root children with query params', (done) => {
    request.
      get(`${baseUrl}/api/files/${rootId}/children`).
      query({ orderBy: 'name', orderDirection: 'ASC' }). // query string
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);

        for (let i = 0; i < jsonData.items.length; i++) {
          let item = jsonData.items[i];
          expect(item.type).to.equal('dir');
          expect(item.parentId).to.equal(rootId);
        }

        workChildDirId = jsonData.items[0].id;
        workChildDirName = jsonData.items[0].name;
        workChildDirId1 = jsonData.items[1].id;
        workChildDirName1 = jsonData.items[1].name;
        rootChildrenSize = jsonData.items.length;

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Get root children with incorrect orderBy', (done) => {
    request.
      get(`${baseUrl}/api/files/${rootId}/children`).
      query({ orderBy: 'nameOne' }).
      catch(err => {
        if (err && err.response && err.response.request.res) {
          expect(err.response.request.res.statusCode).to.equal(400);
          done();
        } else {
          done(err);
        }
      }).
      catch(err => {
        done(err);
      });
  });

  it('Get root children with incorrect orderDirection', (done) => {
    request.
      get(`${baseUrl}/api/files/${rootId}/children`).
      query({ orderDirection: 'DSC' }).
      catch(err => {
        if (err && err.response && err.response.request.res) {
          expect(err.response.request.res.statusCode).to.equal(400);
          done();
        } else {
          done(err);
        }
      }).
      catch(err => {
        done(err);
      });
  });

  it('Get workChildDir children', (done) => {
    request.
      get(`${baseUrl}/api/files/${workChildDirId}/children`).
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);

        for (let i = 0; i < jsonData.items.length; i++) {
          let item = jsonData.items[i];
          expect(item.parentId).to.equal(workChildDirId);
          expect(item.type).to.equal('file');
        }

        workFileId = jsonData.items[0].id;
        workFileName = jsonData.items[0].name;
        workChildrenSize = jsonData.items.length;

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Get children with incorrect id', (done) => {
    request.
      get(`${baseUrl}/api/files/${createIncorrectId(workChildDirId, 'incorrect_dir_name')}/children`).
      catch(err => {
        if (err && err.response && err.response.request.res) {
          expect(err.response.request.res.statusCode).to.equal(410);
          done();
        } else {
          done(err);
        }
      }).
      catch(err => {
        done(err);
      });
  });

  it('Get workChildDir metadata', (done) => {
    request.
      get(`${baseUrl}/api/files/${workChildDirId}`).
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);
        expect(jsonData.id).to.equal(workChildDirId);
        expect(jsonData.name).to.equal(workChildDirName);
        expect(jsonData.type).to.equal("dir");

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Get workFile metadata', (done) => {
    request.
      get(`${baseUrl}/api/files/${workFileId}`).
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);
        expect(jsonData.id).to.equal(workFileId);
        expect(jsonData.name).to.equal(workFileName);
        expect(jsonData.type).to.equal("file");

        done();
      }).
      catch(err => {
        done(err);
      });
  });
});

describe('Search for files/dirs', () => {
  it('Search in root directory (default params)', (done) => {
    let nameSubstring = workChildDirName.slice(1, -1);

    request.
      get(`${baseUrl}/api/files/${rootId}/search`).
      query({
        itemNameSubstring: nameSubstring
      }).
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);
        expect(jsonData.items.length).to.equal(1);

        let item0 = jsonData.items[0];
        expect(item0.type).to.equal('dir');
        expect(item0.parentId).to.equal(rootId);
        expect(item0.name).to.equal(workChildDirName);
        expect(item0.ancestors.length).to.equal(1);

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Search with incorrect id', (done) => {
    request.
      get(`${baseUrl}/api/files/${createIncorrectId(workChildDirId, 'incorrect_dir_name')}/search`).
      query({
        itemNameSubstring: 'name'
      }).
      catch(err => {
        if (err && err.response && err.response.request.res) {
          expect(err.response.request.res.statusCode).to.equal(410);
          done();
        } else {
          done(err);
        }
      }).
      catch(err => {
        done(err);
      });
  });

  it('Search in root directory (default params)', (done) => {
    let nameSubstring = 'c';

    request.
      get(`${baseUrl}/api/files/${rootId}/search`).
      query({
        itemNameSubstring: nameSubstring
      }).
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);
        expect(jsonData.items.length > 1).to.be.true; // eslint-disable-line

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  describe('Various itemNameCaseSensitive', () => {
    it('Default params', (done) => {
      let nameSubstring = workChildDirName.slice(1, -1).toUpperCase();

      request.
        get(`${baseUrl}/api/files/${rootId}/search`).
        query({
          itemNameSubstring: nameSubstring
        }).
        then(res => {
          let jsonData = res.body;

          expect(res.status).to.equal(200);
          expect(jsonData.items.length).to.equal(1);

          let item0 = jsonData.items[0];
          expect(item0.type).to.equal('dir');
          expect(item0.parentId).to.equal(rootId);
          expect(item0.name).to.equal(workChildDirName);

          done();
        }).
        catch(err => {
          done(err);
        });
    });

    it('itemNameCaseSensitive equal false', (done) => {
      let nameSubstring = workChildDirName.slice(1, -1).toUpperCase();

      request.
        get(`${baseUrl}/api/files/${rootId}/search`).
        query({
          itemNameSubstring: nameSubstring,
          itemNameCaseSensitive: false
        }).
        then(res => {
          let jsonData = res.body;

          expect(res.status).to.equal(200);
          expect(jsonData.items.length).to.equal(1);

          let item0 = jsonData.items[0];
          expect(item0.type).to.equal('dir');
          expect(item0.parentId).to.equal(rootId);
          expect(item0.name).to.equal(workChildDirName);
          expect(item0.ancestors.length).to.equal(1);

          done();
        }).
        catch(err => {
          done(err);
        });
    });

    it('itemNameCaseSensitive equal true', (done) => {
      let nameSubstring = workChildDirName.slice(1, -1).toUpperCase();

      request.
        get(`${baseUrl}/api/files/${rootId}/search`).
        query({
          itemNameSubstring: nameSubstring,
          itemNameCaseSensitive: true
        }).
        then(res => {
          let jsonData = res.body;

          expect(res.status).to.equal(200);
          expect(jsonData.items.length).to.equal(0);

          done();
        }).
        catch(err => {
          done(err);
        });
    });
  });

  describe('Various itemType', () => {
    it('itemType equal dir', (done) => {
      let nameSubstring = workChildDirName.slice(1, -1);

      request.
        get(`${baseUrl}/api/files/${rootId}/search`).
        query({
          itemNameSubstring: nameSubstring,
          itemType: 'dir'
        }).
        then(res => {
          let jsonData = res.body;

          expect(res.status).to.equal(200);
          expect(jsonData.items.length).to.equal(1);

          let item0 = jsonData.items[0];
          expect(item0.type).to.equal('dir');
          expect(item0.parentId).to.equal(rootId);
          expect(item0.name).to.equal(workChildDirName);
          expect(item0.ancestors.length).to.equal(1);

          done();
        }).
        catch(err => {
          done(err);
        });
    });

    it('itemType equal file, resource is dir', (done) => {
      let nameSubstring = workChildDirName.slice(1, -1);

      request.
        get(`${baseUrl}/api/files/${rootId}/search`).
        query({
          itemNameSubstring: nameSubstring,
          itemType: 'file'
        }).
        then(res => {
          let jsonData = res.body;

          expect(res.status).to.equal(200);
          expect(jsonData.items.length).to.equal(0);

          done();
        }).
        catch(err => {
          done(err);
        });
    });

    it('itemType equal file, resource is file', (done) => {
      let nameSubstring = workFileName.slice(1, -1);

      request.
        get(`${baseUrl}/api/files/${rootId}/search`).
        query({
          itemNameSubstring: nameSubstring,
          itemType: 'file',
          recursive: true
        }).
        then(res => {
          let jsonData = res.body;

          expect(res.status).to.equal(200);
          expect(jsonData.items.length).to.equal(1);

          let item = jsonData.items[0];
          expect(item.parentId).to.equal(workChildDirId);
          expect(item.type).to.equal('file');

          done();
        }).
        catch(err => {
          done(err);
        });
    });
  });

  describe('Various recursive', () => {
    it('recursive equal false', (done) => {
      let nameSubstring = workFileName.slice(1, -1);

      request.
        get(`${baseUrl}/api/files/${rootId}/search`).
        query({
          itemNameSubstring: nameSubstring,
          itemType: 'file',
          recursive: false
        }).
        then(res => {
          let jsonData = res.body;

          expect(res.status).to.equal(200);
          expect(jsonData.items.length).to.equal(0);

          done();
        }).
        catch(err => {
          done(err);
        });
    });

    it('recursive equal true', (done) => {
      let nameSubstring = workFileName.slice(1, -1);

      request.
        get(`${baseUrl}/api/files/${rootId}/search`).
        query({
          itemNameSubstring: nameSubstring,
          itemType: 'file',
          recursive: true
        }).
        then(res => {
          let jsonData = res.body;

          expect(res.status).to.equal(200);
          expect(jsonData.items.length).to.equal(1);

          let item = jsonData.items[0];
          expect(item.parentId).to.equal(workChildDirId);
          expect(item.type).to.equal('file');

          done();
        }).
        catch(err => {
          done(err);
        });
    });
  });
});

describe('Rename resources', () => {
  it('Rename dir', (done) => {
    let route = `${baseUrl}/api/files/${workChildDirId}`;
    let method = 'PATCH';
    let newName = 'changed dir';

    request(method, route).
      type('application/json').
      send({ name: newName }).
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);
        expect(jsonData.parentId).to.equal(rootId);
        expect(jsonData.type).to.equal("dir");

        changedWorkChildDirId = jsonData.id;

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Rename resource with incorrect id', (done) => {
    let route = `${baseUrl}/api/files/${createIncorrectId(changedWorkChildDirId, 'incorrect_dir_name')}`;
    let method = 'PATCH';
    let newName = 'bad changed dir';

    request(method, route).
      type('application/json').
      send({ name: newName }).
      catch(err => {
        if (err && err.response && err.response.request.res) {
          expect(err.response.request.res.statusCode).to.equal(410);
          done();
        } else {
          done(err);
        }
      }).
      catch(err => {
        done(err);
      });
  });

  it('Rename root dir', (done) => {
    let route = `${baseUrl}/api/files/${rootId}`;
    let method = 'PATCH';
    let newName = 'new root';

    request(method, route).
      type('application/json').
      send({ name: newName }).
      catch(err => {
        if (err && err.response && err.response.request.res) {
          expect(err.response.request.res.statusCode).to.equal(400);
          done();
        } else {
          done(err);
        }
      }).
      catch(err => {
        done(err);
      });
  });

  it('Rename dir (restore dir name)', (done) => {
    let route = `${baseUrl}/api/files/${changedWorkChildDirId}`;
    let method = 'PATCH';

    request(method, route).
      type('application/json').
      send({ name: workChildDirName }).
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);
        expect(jsonData.parentId).to.equal(rootId);
        expect(jsonData.type).to.equal("dir");
        expect(jsonData.id).to.equal(workChildDirId);
        expect(jsonData.name).to.equal(workChildDirName);

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Rename file', (done) => {
    let route = `${baseUrl}/api/files/${workFileId}`;
    let method = 'PATCH';
    let newName = 'changed file';

    request(method, route).
      type('application/json').
      send({ name: newName }).
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);
        expect(jsonData.parentId).to.equal(workChildDirId);
        expect(jsonData.type).to.equal("file");

        changedFileId = jsonData.id;

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Rename file (restore file name)', (done) => {
    let route = `${baseUrl}/api/files/${changedFileId}`;
    let method = 'PATCH';

    request(method, route).
      type('application/json').
      send({ name: workFileName }).
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);
        expect(jsonData.parentId).to.equal(workChildDirId);
        expect(jsonData.type).to.equal("file");
        expect(jsonData.id).to.equal(workFileId);
        expect(jsonData.name).to.equal(workFileName);

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Check root dir', (done) => {
    request.
      get(`${baseUrl}/api/files/${rootId}/children`).
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);
        expect(jsonData.items.length).to.equal(rootChildrenSize);

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Check workChildDir', (done) => {
    request.
      get(`${baseUrl}/api/files/${workChildDirId}/children`).
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);
        expect(jsonData.items.length).to.equal(workChildrenSize);

        done();
      }).
      catch(err => {
        done(err);
      });
  });
});

describe('Create dirs', () => {
  it('Create child dir', done => {
    newDirName = 'new dir';

    let route = `${baseUrl}/api/files`;
    let method = 'POST';
    let params = {
      parentId: rootId,
      name: newDirName,
      type: 'dir'
    };
    request(method, route).
      send(params).
      then(res => {
        let jsonData = res.body;
        let capabilities = jsonData.capabilities;

        expect(res.status).to.equal(200);
        expect(jsonData.parentId).to.equal(rootId);
        expect(jsonData.name).to.equal(newDirName);
        expect(jsonData.type).to.equal('dir');

        expect(capabilities.canListChildren).to.equal(true);
        expect(capabilities.canAddChildren).to.equal(true);
        expect(capabilities.canRemoveChildren).to.equal(true);
        expect(capabilities.canDelete).to.equal(true);
        expect(capabilities.canRename).to.equal(true);
        expect(capabilities.canCopy).to.equal(true);
        expect(capabilities.canEdit).to.equal(false);
        expect(capabilities.canDownload).to.equal(false);

        newDirId = jsonData.id;

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Create grandchild dir 1', done => {
    newGrandchildName1 = 'grandchild dir 1';

    let route = `${baseUrl}/api/files`;
    let method = 'POST';
    let params = {
      parentId: newDirId,
      name: newGrandchildName1,
      type: 'dir'
    };
    request(method, route).
      send(params).
      then(res => {
        let jsonData = res.body;
        let capabilities = jsonData.capabilities;

        expect(res.status).to.equal(200);
        expect(jsonData.parentId).to.equal(newDirId);
        expect(jsonData.name).to.equal(newGrandchildName1);
        expect(jsonData.type).to.equal('dir');

        expect(capabilities.canListChildren).to.equal(true);
        expect(capabilities.canAddChildren).to.equal(true);
        expect(capabilities.canRemoveChildren).to.equal(true);
        expect(capabilities.canDelete).to.equal(true);
        expect(capabilities.canRename).to.equal(true);
        expect(capabilities.canCopy).to.equal(true);
        expect(capabilities.canEdit).to.equal(false);
        expect(capabilities.canDownload).to.equal(false);

        newGrandchildId1 = jsonData.id;

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Create grandchild dir 2', done => {
    newGrandchildName2 = 'grandchild dir 2';

    let route = `${baseUrl}/api/files`;
    let method = 'POST';
    let params = {
      parentId: newDirId,
      name: newGrandchildName2,
      type: 'dir'
    };
    request(method, route).
      send(params).
      then(res => {
        let jsonData = res.body;
        let capabilities = jsonData.capabilities;

        expect(res.status).to.equal(200);
        expect(jsonData.parentId).to.equal(newDirId);
        expect(jsonData.name).to.equal(newGrandchildName2);
        expect(jsonData.type).to.equal('dir');

        expect(capabilities.canListChildren).to.equal(true);
        expect(capabilities.canAddChildren).to.equal(true);
        expect(capabilities.canRemoveChildren).to.equal(true);
        expect(capabilities.canDelete).to.equal(true);
        expect(capabilities.canRename).to.equal(true);
        expect(capabilities.canCopy).to.equal(true);
        expect(capabilities.canEdit).to.equal(false);
        expect(capabilities.canDownload).to.equal(false);

        newGrandchildId2 = jsonData.id;

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Create grandchild dir 3', done => {
    newGrandchildName3 = 'grandchild dir 3';

    let route = `${baseUrl}/api/files`;
    let method = 'POST';
    let params = {
      parentId: newDirId,
      name: newGrandchildName3,
      type: 'dir'
    };
    request(method, route).
      send(params).
      then(res => {
        let jsonData = res.body;
        let capabilities = jsonData.capabilities;

        expect(res.status).to.equal(200);
        expect(jsonData.parentId).to.equal(newDirId);
        expect(jsonData.name).to.equal(newGrandchildName3);
        expect(jsonData.type).to.equal('dir');

        expect(capabilities.canListChildren).to.equal(true);
        expect(capabilities.canAddChildren).to.equal(true);
        expect(capabilities.canRemoveChildren).to.equal(true);
        expect(capabilities.canDelete).to.equal(true);
        expect(capabilities.canRename).to.equal(true);
        expect(capabilities.canCopy).to.equal(true);
        expect(capabilities.canEdit).to.equal(false);
        expect(capabilities.canDownload).to.equal(false);

        newGrandchildId3 = jsonData.id;

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Create dir with incorrect :id', done => {
    let route = `${baseUrl}/api/files`;
    let method = 'POST';
    let incorrectId = createIncorrectId(newDirId, 'incorrect_dir');
    let params = {
      parentId: incorrectId,
      name: 'new dir 1',
      type: 'dir'
    };
    request(method, route).
      send(params).
      catch(err => {
        if (err && err.response && err.response.request.res) {
          expect(err.response.request.res.statusCode).to.equal(410);
          done();
        } else {
          done(err);
        }
      }).
      catch(err => {
        done(err);
      });
  });

  it('Create dir without parentId', done => {
    let route = `${baseUrl}/api/files`;
    let method = 'POST';
    let params = {
      name: 'new dir 1',
      type: 'dir'
    };
    request(method, route).
      send(params).
      catch(err => {
        if (err && err.response && err.response.request.res) {
          expect(err.response.request.res.statusCode).to.equal(400);
          done();
        } else {
          done(err);
        }
      }).
      catch(err => {
        done(err);
      });
  });

  it('Create dir without type', done => {
    let route = `${baseUrl}/api/files`;
    let method = 'POST';
    let params = {
      parentId: newDirId,
      name: 'new dir 1',
    };
    request(method, route).
      send(params).
      catch(err => {
        if (err && err.response && err.response.request.res) {
          expect(err.response.request.res.statusCode).to.equal(400);
          done();
        } else {
          done(err);
        }
      }).
      catch(err => {
        done(err);
      });
  });

  it('Create dir and attach file', done => {
    let workDirPath = `../../demo/demo-fs/${workChildDirName}`;
    let fileName = fs.readdirSync(workDirPath)[0];
    let file = fs.readFileSync(`${workDirPath}/${fileName}`);
    let route = `${baseUrl}/api/files`;

    request.post(route).
      field('type', 'dir').
      field('name', 'new dir 1').
      field('parentId', newGrandchildId3).
      attach('files', file, fileName).
      catch(err => {
        if (err && err.response && err.response.request.res) {
          expect(err.response.request.res.statusCode).to.equal(400);
          done();
        } else {
          done(err);
        }
      }).
      catch(err => {
        done(err);
      });
  });

  it('Check newDir', done => {
    request.
      get(`${baseUrl}/api/files/${newDirId}/children`).
      then(res => {
        let jsonData = res.body;
        newDirSize = jsonData.items.length;

        expect(res.status).to.equal(200);
        expect(newDirSize).to.equal(3);

        for (let i = 0; i < newDirSize; i++) {
          let item = jsonData.items[i];
          expect(item.type).to.equal('dir');
          expect(item.parentId).to.equal(newDirId);
        }

        done();
      }).
      catch(err => {
        done(err);
      });
  });
});

describe('Copy resouces', () => {
  it('Copy file', done => {
    let route = `${baseUrl}/api/files/${workFileId}`;
    let method = 'PATCH';

    request(method, route).
      type('application/json').
      send({ parents: [newGrandchildId1, workChildDirId] }).
      then(res => {
        let jsonData = res.body;
        let capabilities = jsonData.capabilities;

        expect(res.status).to.equal(200);

        expect(jsonData.parentId).to.equal(newGrandchildId1);
        expect(jsonData.name).to.equal(workFileName);
        expect(jsonData.type).to.equal("file");

        // expect(capabilities.canListChildren).to.equal(true);
        // expect(capabilities.canAddChildren).to.equal(true);
        // expect(capabilities.canRemoveChildren).to.equal(true);
        expect(capabilities.canDelete).to.equal(true);
        expect(capabilities.canRename).to.equal(true);
        expect(capabilities.canCopy).to.equal(true);
        expect(capabilities.canEdit).to.equal(true);
        expect(capabilities.canDownload).to.equal(true);

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Copy file with incorrect id-1', (done) => {
    let route = `${baseUrl}/api/files/${createIncorrectId(workChildDirId, 'incorrect_dir_name')}`;
    let method = 'PATCH';

    request(method, route).
      type('application/json').
      send({ parents: [newGrandchildId1, workChildDirId] }).
      catch(err => {
        if (err && err.response && err.response.request.res) {
          expect(err.response.request.res.statusCode).to.equal(410);
          done();
        } else {
          done(err);
        }
      }).
      catch(err => {
        done(err);
      });
  });

  it('Copy file with incorrect id-2', (done) => {
    let route = `${baseUrl}/api/files/${workFileId}`;
    let method = 'PATCH';

    request(method, route).
      type('application/json').
      send({ parents: [createIncorrectId(workChildDirId, 'incorrect_dir_name'), workChildDirId] }).
      catch(err => {
        if (err && err.response && err.response.request.res) {
          expect(err.response.request.res.statusCode).to.equal(410);
          done();
        } else {
          done(err);
        }
      }).
      catch(err => {
        done(err);
      });
  });

  it('Copy file with incorrect id-3', (done) => {
    let route = `${baseUrl}/api/files/${workFileId}`;
    let method = 'PATCH';

    request(method, route).
      type('application/json').
      send({ parents: [newGrandchildId1, createIncorrectId(workChildDirId, 'incorrect_dir_name')] }).
      catch(err => {
        if (err && err.response && err.response.request.res) {
          expect(err.response.request.res.statusCode).to.equal(400);
          done();
        } else {
          done(err);
        }
      }).
      catch(err => {
        done(err);
      });
  });

  it('Copy file with new name', done => {
    copiedFileName = 'copied file';
    let route = `${baseUrl}/api/files/${workFileId}`;
    let method = 'PATCH';
    let params = {
      name: copiedFileName,
      parents: [newGrandchildId1, workChildDirId]
    };

    request(method, route).
      type('application/json').
      send(params).
      then(res => {
        let jsonData = res.body;
        let capabilities = jsonData.capabilities;

        expect(res.status).to.equal(200);

        expect(jsonData.parentId).to.equal(newGrandchildId1);
        expect(jsonData.name).to.equal(copiedFileName);
        expect(jsonData.type).to.equal("file");

        // expect(capabilities.canListChildren).to.equal(true);
        // expect(capabilities.canAddChildren).to.equal(true);
        // expect(capabilities.canRemoveChildren).to.equal(true);
        expect(capabilities.canDelete).to.equal(true);
        expect(capabilities.canRename).to.equal(true);
        expect(capabilities.canCopy).to.equal(true);
        expect(capabilities.canEdit).to.equal(true);
        expect(capabilities.canDownload).to.equal(true);

        copiedFileId = jsonData.id;

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Copy file to sibling dir', done => {
    let route = `${baseUrl}/api/files/${copiedFileId}`;
    let method = 'PATCH';
    let params = {
      name: copiedFileName,
      parents: [newGrandchildId1, newGrandchildId2]
    };

    request(method, route).
    type('application/json').
    send(params).
    then(res => {
      let jsonData = res.body;
      let capabilities = jsonData.capabilities;

        expect(res.status).to.equal(200);

        expect(jsonData.parentId).to.equal(newGrandchildId2);
        expect(jsonData.name).to.equal(copiedFileName);
        expect(jsonData.type).to.equal("file");

        // expect(capabilities.canListChildren).to.equal(true);
        // expect(capabilities.canAddChildren).to.equal(true);
        // expect(capabilities.canRemoveChildren).to.equal(true);
        expect(capabilities.canDelete).to.equal(true);
        expect(capabilities.canRename).to.equal(true);
        expect(capabilities.canCopy).to.equal(true);
        expect(capabilities.canEdit).to.equal(true);
        expect(capabilities.canDownload).to.equal(true);

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Check workChildDir', done => {
    request.
      get(`${baseUrl}/api/files/${workChildDirId}/children`).
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);
        expect(jsonData.items.length).to.equal(workChildrenSize);

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Check newGrandchildId1', done => {
    request.
      get(`${baseUrl}/api/files/${newGrandchildId1}/children`).
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);
        expect(jsonData.items.length).to.equal(2);

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Check newGrandchildId2', done => {
    request.
      get(`${baseUrl}/api/files/${newGrandchildId2}/children`).
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);
        expect(jsonData.items.length).to.equal(1);

        done();
      }).
      catch(err => {
        done(err);
      });
  });
});

describe('Move resources', () => {
  it('Move file with incorrect id-1', (done) => {
    let route = `${baseUrl}/api/files/${createIncorrectId(copiedFileId, 'incorrect_dir_name')}`;
    let method = 'PATCH';
    let params = {
      parents: [newGrandchildId3]
    };

    request(method, route).
      type('application/json').
      send(params).
      catch(err => {
        if (err && err.response && err.response.request.res) {
          expect(err.response.request.res.statusCode).to.equal(410);
          done();
        } else {
          done(err);
        }
      }).
      catch(err => {
        done(err);
      });
  });

  it('Move file with incorrect id-2', (done) => {
    let route = `${baseUrl}/api/files/${copiedFileId}`;
    let method = 'PATCH';
    let params = {
      parents: [createIncorrectId(copiedFileId, 'incorrect_dir_name')]
    };

    request(method, route).
      type('application/json').
      send(params).
      catch(err => {
        if (err && err.response && err.response.request.res) {
          expect(err.response.request.res.statusCode).to.equal(410);
          done();
        } else {
          done(err);
        }
      }).
      catch(err => {
        done(err);
      });
  });

  it('Move file', done => {
    let route = `${baseUrl}/api/files/${copiedFileId}`;
    let method = 'PATCH';
    let params = {
      parents: [newGrandchildId3]
    };

    request(method, route).
      type('application/json').
      send(params).
      then(res => {
        let jsonData = res.body;
        let capabilities = jsonData.capabilities;

        expect(res.status).to.equal(200);

        expect(jsonData.parentId).to.equal(newGrandchildId3);
        expect(jsonData.name).to.equal(copiedFileName);
        expect(jsonData.type).to.equal("file");

        // expect(capabilities.canListChildren).to.equal(true);
        // expect(capabilities.canAddChildren).to.equal(true);
        // expect(capabilities.canRemoveChildren).to.equal(true);
        expect(capabilities.canDelete).to.equal(true);
        expect(capabilities.canRename).to.equal(true);
        expect(capabilities.canCopy).to.equal(true);
        expect(capabilities.canEdit).to.equal(true);
        expect(capabilities.canDownload).to.equal(true);

        copiedFileId3 = jsonData.id;

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Check newGrandchildId1', done => {
    request.
      get(`${baseUrl}/api/files/${newGrandchildId1}/children`).
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);
        expect(jsonData.items.length).to.equal(1);

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Check newGrandchildId2', done => {
    request.
      get(`${baseUrl}/api/files/${newGrandchildId2}/children`).
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);
        expect(jsonData.items.length).to.equal(1);

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Check newGrandchildId3', done => {
    request.
      get(`${baseUrl}/api/files/${newGrandchildId3}/children`).
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);
        expect(jsonData.items.length).to.equal(1);

        done();
      }).
      catch(err => {
        done(err);
      });
  });
});

describe('Download', () => {
  it('Download file', done => {
    const downloadUrl = `${baseUrl}/api/download?items=${copiedFileId3}`;
    request.get(downloadUrl).
      responseType('blob').
      then(res => {
        expect(res.status).to.equal(200);
        expect(res.headers['content-disposition']).to.equal(`attachment; filename="${copiedFileName}"`);

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Download folder', done => {
    const downloadUrl = `${baseUrl}/api/download?items=${newGrandchildId3}`;
    request.get(downloadUrl).
      responseType('blob').
      then(res => {
        expect(res.status).to.equal(200);
        expect(res.headers['content-disposition']).to.equal(`attachment; filename="${newGrandchildName3}.zip"`);

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Download file with incorrect id', done => {
    const downloadUrl = `${baseUrl}/api/download?items=${createIncorrectId(newGrandchildId3, 'incorrect-dir')}`;
    request.get(downloadUrl).
      responseType('blob').
      catch(err => {
        if (err && err.response && err.response.request.res) {
          expect(err.response.request.res.statusCode).to.equal(410);
          done();
        } else {
          done(err);
        }
      }).
      catch(err => {
        done(err);
      });
  });
});

describe('Upload file', () => {
  it('Upload file with incorrect id', (done) => {
    let workDirPath = `../../demo/demo-fs/${workChildDirName}`;
    let fileName = fs.readdirSync(workDirPath)[0];
    let file = fs.readFileSync(`${workDirPath}/${fileName}`);
    let route = `${baseUrl}/api/files`;

    request.post(route).
      field('type', 'file').
      field('parentId', createIncorrectId(newGrandchildId3, 'incorrect_dir_name')).
      attach('files', file, fileName).

      catch(err => {
        if (err && err.response && err.response.request.res) {
          expect(err.response.request.res.statusCode).to.equal(410);
          done();
        } else {
          done(err);
        }
      }).
      catch(err => {
        done(err);
      });
  });

  it('Upload file', done => {
    let workDirPath = `../../demo/demo-fs/${workChildDirName}`;
    let fileName = fs.readdirSync(workDirPath)[0];
    let file = fs.readFileSync(`${workDirPath}/${fileName}`);
    let route = `${baseUrl}/api/files`;

    request.post(route).
      field('type', 'file').
      field('parentId', newGrandchildId3).
      attach('files', file, fileName).
      then(res => {
        let jsonData = res.body[0];
        let capabilities = jsonData.capabilities;

        expect(res.status).to.equal(200);

        expect(jsonData.parentId).to.equal(newGrandchildId3);
        expect(jsonData.name).to.equal(fileName);
        expect(jsonData.type).to.equal("file");

        // expect(capabilities.canListChildren).to.equal(true);
        // expect(capabilities.canAddChildren).to.equal(true);
        // expect(capabilities.canRemoveChildren).to.equal(true);
        expect(capabilities.canDelete).to.equal(true);
        expect(capabilities.canRename).to.equal(true);
        expect(capabilities.canCopy).to.equal(true);
        expect(capabilities.canEdit).to.equal(true);
        expect(capabilities.canDownload).to.equal(true);

        done();
      }).
      catch(err => {
        done(err);
      });
  });
});

describe('Remove resources', () => {
  it('Remove file', done => {
    let route = `${baseUrl}/api/files/${copiedFileId3}`;
    let method = 'DELETE';
    request(method, route).
      then(res => {
        expect(res.status).to.equal(200);

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Check newGrandchildId3', done => {
    request.
      get(`${baseUrl}/api/files/${newGrandchildId3}/children`).
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);
        expect(jsonData.items.length).to.equal(1);

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Remove resource with incorrect id', done => {
    let route = `${baseUrl}/api/files/${createIncorrectId(newDirId, 'incorrect-dir')}`;
    let method = 'DELETE';
    request(method, route).
      then(res => {
        expect(res.status).to.equal(200);

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Remove root dir', done => {
    let route = `${baseUrl}/api/files/${rootId}`;
    let method = 'DELETE';
    request(method, route).
      catch(err => {
        if (err && err.response && err.response.request.res) {
          expect(err.response.request.res.statusCode).to.equal(400);
          done();
        } else {
          done(err);
        }
      }).
      catch(err => {
        done(err);
      });
  });

  it('Remove dir', done => {
    let route = `${baseUrl}/api/files/${newGrandchildId3}`;
    let method = 'DELETE';
    request(method, route).
      then(res => {
        expect(res.status).to.equal(200);

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Check newDir', done => {
    request.
      get(`${baseUrl}/api/files/${newDirId}/children`).
      then(res => {
        let jsonData = res.body;

        expect(res.status).to.equal(200);
        expect(jsonData.items.length).to.equal(newDirSize - 1);

        done();
      }).
      catch(err => {
        done(err);
      });
  });

  it('Remove not empty dir', done => {
    let route = `${baseUrl}/api/files/${newDirId}`;
    let method = 'DELETE';
    request(method, route).
      then(res => {
        expect(res.status).to.equal(200);

        done();
      }).
      catch(err => {
        done(err);
      });
  });
});
