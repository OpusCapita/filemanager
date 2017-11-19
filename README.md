# Filemanager

![badge-circleci](https://img.shields.io/circleci/project/github/RedSparr0w/node-csgo-parser.svg) 
![badge-npm](https://img.shields.io/npm/v/@opuscapita/react-filemanager.svg)
![badge-license](https://img.shields.io/github/license/OpusCapita/filemanager.svg)

> **Initial release [v1.0.0](https://github.com/OpusCapita/filemanager/wiki/v1.0.0) is coming. [Stay tuned… :zap:](https://github.com/OpusCapita/filemanager/milestone/1)**

## [Demo](http://opuscapita-filemanager-demo.azurewebsites.net/?currentComponentId=%40opuscapita%2Freact-filemanager%2F0.0.2%2FFileManager&maxContainerWidth=100%25&showSidebar=false)

> Demo powered by [React Showroom](https://github.com/OpusCapita/react-showroom-client)

### Packages

* [Client React](./packages/client-react)
* [Server Node](./packages/server-node)
* [Client React connector for Server Node API v1](./packages/connector-node-v1)
* [Client React connector for Google Drive API v2](./packages/connector-google-drive-v2)

Detailed documentation for each package is coming soon.

### Basic usage

Client implementation is an npm package which can you can include to your application.
It built using [Facebook ReactJS](https://reactjs.org/) library.

It supports custom connectors to different file storages.
Predefined connectors are [Server Node API v1](./packages/connector-node-v1) and [Google Drive API v2](./packages/connector-google-drive-v2). You can write you own.

#### Run Node server

Install package

```
npm install --save @opuscapita/filemanager-server
```

Now you have at least two variants how to use it:

* Start as application

```
let config = {
  fsRoot: __dirname,
  rootName: 'Root folder',
  port: process.env.PORT || '3020',
  host: process.env.HOST || 'localhost'
};

let filemanager = require('@opuscapita/filemanager-server`);
filemanager.run(config);
```

* [Use as middleware](https://github.com/OpusCapita/filemanager/blob/master/demo/index.js)

#### Run client

```
npm install --save @opuscapita/react-filemanager @opuscapita

```

[**Server Node API v1 Documentation**](http://opuscapita-filemanager-demo.azurewebsites.net/api/docs/)

## Contributing

### Run from clonned repo:

```
git clone git@github.com:OpusCapita/filemanager.git
```

```
npm run bootstrap && npm start
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
