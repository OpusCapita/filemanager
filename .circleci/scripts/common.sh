#!/usr/bin/env bash

DOCKER_REPO="opuscapita/filemanager-demo"
DOCKER_PORT=3020

slugify() {
  echo $1 | iconv -t ascii//TRANSLIT | sed -E s/[^a-zA-Z0-9]+/-/g | sed -E s/^-+\|-+$//g | tr A-Z a-z | cut -c1-53
}

DOCKER_TAG=$(slugify "${CIRCLE_BRANCH}")