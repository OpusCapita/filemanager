#!/usr/bin/env bash

set -euo pipefail

slugify() {
  # replaces non latin characters to latin
  # replaces all not letters/numbers with '-'
  # replaces all '-' at the beginning and at the end
  # replaces all upper case letters with lower case letters
  # returns substring using first 53 letter
  echo $1 | iconv -t ascii//TRANSLIT | sed -E s/[^a-zA-Z0-9]+/-/g | sed -E s/^-+\|-+$//g | tr A-Z a-z | cut -c1-53
}

GITHUB_PROJECT="${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}"

DOCKER_IMAGE_REPOSITORY=$(echo ${GITHUB_PROJECT} | tr '[:upper:]' '[:lower:]')
DOCKER_IMAGE_TAG=$(slugify "${CIRCLE_BRANCH}")

docker login -u $DOCKER_USER -p $DOCKER_PASS
docker build --no-cache -t $DOCKER_IMAGE_REPOSITORY:$DOCKER_IMAGE_TAG .
docker push $DOCKER_IMAGE_REPOSITORY:$DOCKER_IMAGE_TAG