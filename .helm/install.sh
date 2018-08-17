#!/usr/bin/env bash

. .circleci/scripts/common.sh

RELEASE_NAME=$(slugify "${CIRCLE_PROJECT_REPONAME}-${CIRCLE_BRANCH}")

BASE_URL=`echo "/${CIRCLE_PROJECT_REPONAME}/${CIRCLE_BRANCH}" | cut -c1-53`

SCRIPT_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

helm upgrade \
     --install \
     --force \
     --set image.repository="${DOCKER_REPO}" \
     --set image.tag="${DOCKER_TAG}" \
     --set ingress.baseUrl="${BASE_URL}" \
     --set github.project="${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}" \
     --set vcs.ref="${CIRCLE_SHA1}" \
     --namespace minsk-sandbox \
     ${RELEASE_NAME} ${SCRIPT_DIR}