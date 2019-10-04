#!/usr/bin/env bash

set -eo pipefail

echo "[INFO] Trying to authenticate to Docker registry"

dockerhub_user=$( vault kv get -field=value machineuser/DOCKER_USER )
dockerhub_password=$( vault kv get -field=value machineuser/DOCKER_PASS )

echo "[INFO] Trying to authenticate to Docker registry as user: $dockerhub_user"

echo "$dockerhub_password" | docker login -u "$dockerhub_user"  --password-stdin
