#!/usr/bin/env bash

set -eo pipefail

echo "[INFO] Pushing application image to DockerHub"

script_dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

docker_repository="$( . $script_dir/../get-docker-repository.sh )"
docker_tag="$( . $script_dir/../get-docker-tag.sh )"

docker push "$docker_repository":"$docker_tag"
