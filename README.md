# Filemanager

[![badge-circleci](https://img.shields.io/circleci/project/github/RedSparr0w/node-csgo-parser.svg)](https://circleci.com/gh/OpusCapita/filemanager)
[![badge-npm](https://img.shields.io/npm/dm/@opuscapita/react-filemanager.svg)](https://www.npmjs.com/package/@opuscapita/react-filemanager)
[![badge-license](https://img.shields.io/github/license/OpusCapita/filemanager.svg)](./LICENSE)

## [Demo](https://demo.core.dev.opuscapita.com/filemanager/master/?currentComponentName=FileManager&maxContainerWidth=100%25&showSidebar=false)

## [React Documentation](https://demo.core.dev.opuscapita.com/filemanager/master/?currentComponentName=FileNavigator&maxContainerWidth=100%25&showSidebar=true)

> Demo and react documentation are powered by [React Showroom](https://github.com/OpusCapita/react-showroom-client)

### Packages

* [Client React](./packages/client-react)
* [Server Node](./packages/server-nodejs)
* [Client React connector for Server Node API v1](./packages/connector-node-v1)
* [Client React connector for Google Drive API v2](./packages/connector-google-drive-v2)

Detailed documentation for each package is coming soon.

### Spring Boot Starter

Spring boot applications can benefit from Spring boot starter package found here:

* [Spring Boot](./spring-boot) - see README there for details

### Basic usage

Client implementation is an npm package which can be embed into your application.
It uses [React](https://reactjs.org/) framework and supports connectors to different file storages.
Predefined connectors are:

* [Client React connector for Server Node API v1](./packages/connector-node-v1)
* [Client React connector for Google Drive API v2](./packages/connector-google-drive-v2)

You can write you own custom connectors (documentation on how to do it will appear later).

#### How to use Server Node

[**Server Node API v1 Documentation**](https://demo.core.dev.opuscapita.com/filemanager/master/api/docs)

Install package

```shell
npm install --save @opuscapita/filemanager-server
```

Now you have at least two ways of using it:

* Start as application

```js
let config = {
  fsRoot: __dirname,
  rootName: 'Root folder',
  port: process.env.PORT || '3020',
  host: process.env.HOST || 'localhost'
};

let filemanager = require('@opuscapita/filemanager-server');
filemanager.server.run(config);
```

* [Use as middleware](https://github.com/OpusCapita/filemanager/blob/abbe7b00f57f86c25ed5eae2673920c02ec1859f/packages/demoapp/index.js#L5)

#### How to use Client React

Install packages

```shell
npm install --save @opuscapita/react-filemanager @opuscapita/react-filemanager-connector-node-v1
```

Use it as a child component of you application

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { FileManager, FileNavigator } from '@opuscapita/react-filemanager';
import connectorNodeV1 from '@opuscapita/react-filemanager-connector-node-v1';

const apiOptions = {
  ...connectorNodeV1.apiOptions,
  apiRoot: `http://opuscapita-filemanager-demo-master.azurewebsites.net/` // Or you local Server Node V1 installation.
}

const fileManager = (
 <div style={{ height: '480px' }}>
    <FileManager>
      <FileNavigator
        id="filemanager-1"
        api={connectorNodeV1.api}
        apiOptions={apiOptions}
        capabilities={connectorNodeV1.capabilities}
        listViewLayout={connectorNodeV1.listViewLayout}
        viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
      />
    </FileManager>
  </div>
);

ReactDOM.render(fileManager, document.body);
```

#### [Changelog](https://github.com/OpusCapita/filemanager/blob/master/CHANGELOG.md)
#### [Code of Conduct](https://github.com/OpusCapita/filemanager/blob/master/.github/CODE_OF_CONDUCT.md)
#### [Contributing Guide](https://github.com/OpusCapita/filemanager/blob/master/.github/CONTRIBUTING.md)

## Development

In any directory with `Makefile` (including repo's root) type `make` to see available commands (requires `make` utility to be installed locally, ideally GNU MAKE 4.2.1).

There're prebuilt docker images with tools needed for building code and deploying demo application:
```
make container-for-code # starts a container, where one can execute 'make' to test/build/etc code (both for JS and Spring boot parts)
// or
make container-for-deployment # starts a container, where one can execute 'make' with goals related to deployment of demo application
```

### Main contributors

| [<img src="https://avatars.githubusercontent.com/u/24603787?v=3" width="100px;"/>](https://github.com/asergeev-sc) | [**Alexey Sergeev**](https://github.com/asergeev-sc)     |
| :---: | :---: |
| [<img src="https://avatars.githubusercontent.com/u/24652543?v=3" width="100px;"/>](https://github.com/kvolkovich-sc) | [**Kirill Volkovich**](https://github.com/kvolkovich-sc) |
| [<img src="https://avatars1.githubusercontent.com/u/24649844?s=400&v=4" width="100px;"/>](https://github.com/amourzenkov-sc) | [**Andrei Mourzenkov**](https://github.com/amourzenkov-sc) |
  [<img src="https://avatars.githubusercontent.com/u/28590602?v=3" width="100px;"/>](https://github.com/abaliunov-sc) | [**Aleksandr Baliunov**](https://github.com/abaliunov-sc) |
  [<img src="https://avatars0.githubusercontent.com/u/31243790?s=460&v=4" width="100px;"/>](https://github.com/estambakio-sc) | [**Egor Stambakio**](https://github.com/estambakio-sc) |

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](./LICENSE) for the full license text.
