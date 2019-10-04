#!/usr/bin/env bash

set -e -o pipefail

echo "[INFO] Install dependencies"
script_dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
. $script_dir/configure-npm.sh

git_repo_dir=$( git rev-parse --show-toplevel )
cd $git_repo_dir

npm install --unsafe-perm
