# Contributing

### Run from clonned repo:

```shell
git clone git@github.com:OpusCapita/filemanager.git
```

```shell
npm run bootstrap && npm start
```

### Release process (only for collaborators at npmjs.com)

#### Changelog generation

For [CHANGELOG.md](./CHANGELOG.md) generation we use https://github.com/skywinder/github-changelog-generator

Requirements:

* Installed [docker](https://www.docker.com/community-edition)
* `GITHUB_TOKEN` environment variable ([more details](https://github.com/skywinder/github-changelog-generator#github-token))

```npm run bootstrap && npm run publish``` then choose proper version.

If you want to release a beta version, choose `prerelease`.

[Lerna](https://github.com/lerna/lerna) automatically set proper version for each package and adds git tag.
