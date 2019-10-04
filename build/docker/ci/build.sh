#!/usr/bin/env bash

set -eo pipefail

echo "[INFO] Building CI image"

script_dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

docker_repository="$( . $script_dir/../get-docker-repository.sh )"

docker build -t "$docker_repository":ci $script_dir
