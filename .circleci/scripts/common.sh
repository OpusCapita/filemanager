#!/usr/bin/env bash

slugify() {
  echo $1 | iconv -t ascii//TRANSLIT | sed -E s/[^a-zA-Z0-9]+/-/g | sed -E s/^-+\|-+$//g | tr A-Z a-z | cut -c1-53
}

DOCKER_REPO=$(echo "$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME-demo" | tr '[:upper:]' '[:lower:]')
DOCKER_TAG=$(slugify "${CIRCLE_BRANCH}")

BASE_URL=`echo "/${CIRCLE_PROJECT_REPONAME}/${CIRCLE_BRANCH}" | cut -c1-53`
