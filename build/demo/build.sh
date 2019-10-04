#!/usr/bin/env bash

set -e -o pipefail

echo "[INFO] Install dependencies"
script_dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
. $script_dir/configure-npm.sh

git_repo_dir=$( git rev-parse --show-toplevel )
cd $git_repo_dir

# 'npm run build' is not required because build step is used only before publishing
# but let's keep it here for sake of continuous testing
npm run build

# Build client static files

cd ${git_repo_dir}/packages/client-react
npm run gh-pages:build
rm -rf ../demoapp/static
mkdir -p ../demoapp/static
mv .gh-pages-tmp/* ../demoapp/static/

# Build server API docs

cd ${git_repo_dir}/packages/server-nodejs
npm run build-api-docs
mkdir -p ../demoapp/static/api
cp -r api-docs.tmp/docs ../demoapp/static/api

# Generate demo files

mkdir -p ${git_repo_dir}/packages/demoapp/demoapp/demo-files
${git_repo_dir}/demo-filesystem/populate-demo-fs.sh ${git_repo_dir}/packages/demoapp/demo-files
