#!/usr/bin/env bash

set -eo pipefail

echo "[INFO] Pushing CI image to DockerHub"

script_dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

docker_repository="$( . $script_dir/../get-docker-repository.sh )"

docker push "$docker_repository":ci
