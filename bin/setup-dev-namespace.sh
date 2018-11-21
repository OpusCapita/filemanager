#!/usr/bin/env bash

set -e

echo "setup-dev-namespace.sh"

while [ $# -gt 0 ]; do
  case "$1" in
		--name=*)
      NAME="${1#*=}"
      ;;
    --gh-repo-link=*)
      GH_REPO_LINK="${1#*=}"
      ;;
    --gh-branch=*)
      GH_BRANCH="${1#*=}"
      ;;
    --gh-commit=*)
      GH_COMMIT="${1#*=}"
      ;;
    --ci-build-url=*)
      CI_BUILD_URL="${1#*=}"
      ;;
		--required-secret-name=*)
      REQUIRED_SECRET_NAME="${1#*=}"
      ;;
    *)
      printf "Error: Invalid argument ${1}\n"
      exit 1
  esac
  shift
done

echo "NAME: ${NAME}"
echo "GH_REPO_LINK: ${GH_REPO_LINK}"
echo "GH_BRANCH: ${GH_BRANCH}"
echo "GH_COMMIT: ${GH_COMMIT}"
echo "CI_BUILD_URL: ${CI_BUILD_URL}"

if [ -z "$NAME" ] || [ -z "$GH_REPO_LINK" ] || [ -z "$GH_BRANCH" ] || [ -z "$GH_COMMIT" ] || [ -z "$CI_BUILD_URL" ]; then
	echo "Missing one or more parameters, exiting. See output above for details."
	exit 1
fi

# setup a namespace and label namespace to allow synchronizing common secrets by Kubed service
if kubectl get namespace ${NAME}; then
  echo "Namespace ${NAME} already exists."
  # kubectl label namespace ${NAME} opuscapita.com/require-common-secrets=true --overwrite
else
  kubectl create namespace ${NAME}
  # kubectl label namespace ${NAME} opuscapita.com/require-common-secrets=true
fi

# add metadata as annotations. It's consumed by external tools like k8s dashboard tool
kubectl annotate namespace ${NAME} opuscapita.com/github-source-url=${GH_REPO_LINK}/tree/${GH_BRANCH} --overwrite
kubectl annotate namespace ${NAME} opuscapita.com/github-commit-url=${GH_REPO_LINK}/commit/${GH_COMMIT} --overwrite
kubectl annotate namespace ${NAME} opuscapita.com/ci-url=${CI_BUILD_URL} --overwrite
