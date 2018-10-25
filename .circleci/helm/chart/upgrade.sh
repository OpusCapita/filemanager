#!/usr/bin/env bash

set -e

. ../../scripts/common.sh

RELEASE_NAME=$(slugify "${CIRCLE_PROJECT_REPONAME}-${CIRCLE_BRANCH}")
PROJECT="${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}"
DEPLOYMENT_URL="http://${MINSK_CORE_K8S_DEMO_DEPLOYMENTS_HOST}${BASE_URL}"

az login -u "$AZURE_USER" -p "$AZURE_PASS" &> /tmp/az-login.log
az account set -s "$MINSK_CORE_AZURE_SUBSCRIPTION_ID"
az aks get-credentials -n "$MINSK_CORE_K8S_AZURE_NAME" -g "$MINSK_CORE_K8S_AZURE_RG"

helm init --client-only

helm dependency build

helm upgrade \
  --install \
  --force \
  --set ingress.host="${MINSK_CORE_K8S_DEMO_DEPLOYMENTS_HOST}" \
  --set image.repository="${IMAGE_REPOSITORY}" \
  --set image.tag="${IMAGE_TAG}" \
  --set ingress.baseUrl="${BASE_URL}" \
  --set google.apiKey="${MINSK_CORE_DEMO_GOOGLE_DRIVE_API_KEY}" \
  --set google.clientId="${MINSK_CORE_DEMO_GOOGLE_DRIVE_CLIENT_ID}" \
  \
  --set github-status-deployment-link.github.user="${GH_NAME}" \
  --set github-status-deployment-link.github.password="${GH_PASS}" \
  --set github-status-deployment-link.github.project="${PROJECT}" \
  --set github-status-deployment-link.github.ref="${CIRCLE_SHA1}" \
  --set github-status-deployment-link.url="${DEPLOYMENT_URL}" \
  \
  --set selfkiller.azureAks.resourceGroup="${MINSK_CORE_K8S_AZURE_RG}" \
  --set selfkiller.azureAks.clusterName="${MINSK_CORE_K8S_AZURE_NAME}" \
  --set selfkiller.image.repository="${IMAGE_REPOSITORY}" \
  --set selfkiller.image.tag="${IMAGE_TAG}" \
  --set selfkiller.github.project="${PROJECT}" \
  --set selfkiller.github.branch="${CIRCLE_BRANCH}" \
  \
  --set slack-notifications.webhook="${MINSK_CORE_SLACK_CI_WEBHOOK_URL}" \
  --set slack-notifications.github.project="${PROJECT}" \
  --set slack-notifications.github.branch="${CIRCLE_BRANCH}" \
  --set slack-notifications.github.user="${CIRCLE_USERNAME}" \
  --set slack-notifications.github.ref="${CIRCLE_SHA1}" \
  --set slack-notifications.ci.jobUrl="${CIRCLE_BUILD_URL}" \
  --set slack-notifications.link.url="${DEPLOYMENT_URL}" \
  \
  --namespace "${MINSK_CORE_K8S_NAMESPACE_DEVELOPMENT}" \
  ${RELEASE_NAME} .
