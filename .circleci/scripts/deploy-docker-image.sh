#!/usr/bin/env bash

SCRIPT_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

. ${SCRIPT_DIR}/common.sh

docker build -f Dockerfile.demo -t ${IMAGE_REPOSITORY}:${IMAGE_TAG} .
docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}
docker push ${IMAGE_REPOSITORY}:${IMAGE_TAG}
