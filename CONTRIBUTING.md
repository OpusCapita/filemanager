# Contributing

### Run from clonned repo:

```shell
git clone git@github.com:OpusCapita/filemanager.git
```

```shell
npm run bootstrap && npm start
```

### Release process (only for collaborators at npmjs.com)

```npm run bootstrap && npm release``` then choose proper version.

If you want to release a beta version, choose `prerelease`.

[Lerna](https://github.com/lerna/lerna) automatically set proper version for each package and adds git tag.
