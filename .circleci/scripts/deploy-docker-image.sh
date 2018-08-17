#!/usr/bin/env bash

. .circleci/scripts/common.sh

docker build -f Dockerfile.demo -t ${DOCKER_REPO}:${DOCKER_TAG} --build-arg PORT=${DOCKER_PORT} .
docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}
docker push ${DOCKER_REPO}:${DOCKER_TAG}