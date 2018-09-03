#!/usr/bin/env bash

. ../common.sh

RELEASE_NAME=$(slugify "${CIRCLE_PROJECT_REPONAME}-${CIRCLE_BRANCH}")

/bin/scripts/login/aks-login.sh ${MINSK_CORE_K8S_AZURE_RG} ${MINSK_CORE_K8S_AZURE_NAME}

helm init --client-only && \
helm upgrade \
  --install \
  --force \
  --set ingress.host="${MINSK_CORE_K8S_HOST}" \
  --set image.repository="${DOCKER_REPO}" \
  --set image.tag="${DOCKER_TAG}" \
  --set ingress.baseUrl="${BASE_URL}" \
  --set github.project="${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}" \
  --set github.user="${GH_NAME}" \
  --set github.password="${GH_PASS}" \
  --set vcs.ref="${CIRCLE_SHA1}" \
  --set google.apiKey="${MINSK_CORE_DEMO_GOOGLE_DRIVE_API_KEY}" \
  --set google.clientId="${MINSK_CORE_DEMO_GOOGLE_DRIVE_CLIENT_ID}" \
  --namespace "${MINSK_CORE_K8S_NAMESPACE_DEVELOPMENT}" \
  ${RELEASE_NAME} .
