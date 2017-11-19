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
* [Client React connector for Server Node](./packages/connector-node-v1)
* [Client React connector for Google Drive API v2](./packages/connector-google-drive-v2)

Client implementation is an npm package which can you can include to your application.
It built using [Facebook ReactJS](https://reactjs.org/) library.

It supports custom connectors to different file storages. 
Predefined connectors placed [here](./client-react/src/client/connectors). You cat write you own.

### [NodeJS server implementation](./server-nodejs)

[**API Documentation**](http://opuscapita-filemanager-demo.azurewebsites.net/api/docs/)

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
