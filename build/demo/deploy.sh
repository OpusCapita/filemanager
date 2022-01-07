#!/usr/bin/env bash

set -e -o pipefail

script_dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
git_repo_dir=$( git rev-parse --show-toplevel )

#==============================
echo "[INFO] Get required values for deployment"

normalize_kube_resource_name() {
  echo $1 | iconv -t ascii//TRANSLIT | sed -E s/[^a-zA-Z0-9]+/-/g | sed -E s/^-+\|-+$//g | tr A-Z a-z | cut -c1-53
}

azure_user=$( vault kv get -field=value "machineuser/AZURE_USER" )
azure_password=$( vault kv get -field=value "machineuser/AZURE_PASS" )
azure_subscription=$( vault kv get -field=value "machineuser/MINSK_CORE_AZURE_SUBSCRIPTION_ID" )
azure_kube_cluster_name=$( vault kv get -field=value "machineuser/MINSK_CORE_K8S_AZURE_NAME" )
azure_kube_cluster_resource_group=$( vault kv get -field=value "machineuser/MINSK_CORE_K8S_AZURE_RG" )

git_branch=$( git rev-parse --abbrev-ref HEAD )
git_revision=$( git log -1 --format=%H )

github_project=$($script_dir/../get-github-repo-owner-slash-name.sh)
github_project_name=$($script_dir/../get-github-repo-name.sh)
github_project_url="https://github.com/${github_project}"

deployment_host=$( vault kv get -field=value "machineuser/MINSK_CORE_K8S_DEMO_DEPLOYMENTS_HOST" )
deployment_path="/${github_project_name}/$( normalize_kube_resource_name $git_branch )"
deployment_slack_webhook=$( vault kv get -field=value "machineuser/MINSK_CORE_SLACK_CI_WEBHOOK_URL" )
deployment_image_repository=$( . "$git_repo_dir/build/docker/get-docker-repository.sh" )
deployment_image_tag=$( . "$git_repo_dir/build/docker/get-docker-tag.sh" )
deployment_namespace="dev-${github_project_name}-$( normalize_kube_resource_name $git_branch )"
deployment_helm_chart_path="$script_dir/chart"
deployment_helm_release_name="$deployment_namespace"

#==============================
echo "[INFO] Login to Azure"

az login -u "$azure_user" -p "$azure_password"
az account set -s "$azure_subscription"

#==============================
echo "[INFO] Login to Kubernetes cluster"

az aks get-credentials -g "$azure_kube_cluster_resource_group" -n "$azure_kube_cluster_name"

#==============================
echo "[INFO] Setup kube namespace and add meta data"

# setup a namespace and add meta data
cat << EOF | kubectl apply -f -
apiVersion: v1
kind: Namespace
metadata:
  name: ${deployment_namespace}
  labels:
    opuscapita.com/buhtig-s8k: "true"
  annotations:
    opuscapita.com/github-source-url: ${github_project_url}/tree/${git_branch}
    opuscapita.com/github-commit-url: ${github_project_url}/commit/${git_revision}
    opuscapita.com/ci-url: ${CIRCLE_BUILD_URL:=''}
    opuscapita.com/helm-release: ${deployment_helm_release_name}
EOF

#==============================
echo "[INFO] Create dockerhub secret"

kubectl -n ${deployment_namespace} create secret docker-registry dockerhub \
  --docker-server="https://index.docker.io/v1/" \
  --docker-username=$( vault kv get -field=value machineuser/DOCKER_USER ) \
  --docker-password=$( vault kv get -field=value machineuser/DOCKER_PASS ) \
  --dry-run -o yaml | kubectl apply -f -

#==============================
echo "[INFO] Create secret with required environment variables"

cat << EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: filemanager-env
  namespace: ${deployment_namespace}
type: Opaque
stringData:
  API_KEY: $( vault kv get -field=value machineuser/MINSK_CORE_DEMO_GOOGLE_DRIVE_API_KEY )
  CLIENT_ID: $( vault kv get -field=value machineuser/MINSK_CORE_DEMO_GOOGLE_DRIVE_CLIENT_ID )
EOF

#==============================
echo "[INFO] Upgrade Helm release"

helm dependency update "$deployment_helm_chart_path"

github_user=$( vault kv get -field=value "machineuser/GH_NAME" )
github_pass=$( vault kv get -field=value "machineuser/GH_PASS" )

helm upgrade \
  --install \
  --namespace "$deployment_namespace" \
  --set ingress.host="$deployment_host" \
  --set ingress.path="$deployment_path" \
  --set image.repository="$deployment_image_repository" \
  --set image.tag="$deployment_image_tag" \
  --set slack-notifications.webhook="$deployment_slack_webhook" \
  --set slack-notifications.github.user="$github_user" \
  --set slack-notifications.github.project="$github_project" \
  --set slack-notifications.github.branch="$git_branch" \
  --set slack-notifications.github.ref="$git_revision" \
  --set slack-notifications.ci.jobUrl="$ci_url" \
  --set slack-notifications.link.url="https://${deployment_host}${deployment_path}" \
  --set github-status-deployment-link.github.user="$github_user" \
  --set github-status-deployment-link.github.password="$github_pass" \
  --set github-status-deployment-link.github.project="$github_project" \
  --set github-status-deployment-link.github.ref="$git_revision" \
  --set github-status-deployment-link.url="https://${deployment_host}${deployment_path}" \
  --set dockerSecret="dockerhub" \
  "$deployment_helm_release_name" \
  "$deployment_helm_chart_path"
