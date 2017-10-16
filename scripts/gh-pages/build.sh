#!/bin/sh

rm -rf .gh-pages-tmp &&
node node_modules/@opuscapita/react-showroom-server/src/bin/showroom-scan.js src &&
node node_modules/webpack/bin/webpack.js --config ./config/doc/webpack.config.js &&
cp www/index.html .gh-pages-tmp
