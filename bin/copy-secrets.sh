#!/usr/bin/env bash

set -euo pipefail

usage="Usage: $(basename "$0") --from-namespace=lunar-system --to-namespace=my-development-ns --secret=dockerhub --secret=domain.com-tls"

SECRETS=()

while [ $# -gt 0 ]; do
  case "$1" in
    --help)
      echo $usage
      exit 1
      ;;
		--from-namespace=*)
      SOURCE_NAMESPACE="${1#*=}"
      ;;
    --to-namespace=*)
      TARGET_NAMESPACE="${1#*=}"
      ;;
    --secret=*)
      SECRETS+=("${1#*=}")
      ;;
    *)
      echo "Error: Invalid argument ${1}"
      echo $usage
      exit 1
  esac
  shift
done

echo "SOURCE_NAMESPACE: ${SOURCE_NAMESPACE}"
echo "TARGET_NAMESPACE: ${TARGET_NAMESPACE}"
echo "SECRETS: ${SECRETS[@]}"

if [ -z "$SOURCE_NAMESPACE" ] || [ -z "$TARGET_NAMESPACE" ] || [ ${#SECRETS[@]} -eq "0" ]; then
	echo "Missing one or more parameters, exiting. See output above for details."
  echo $usage
	exit 1
fi

for secret in "${SECRETS[@]}"
do
   kubectl get secret ${secret} --namespace=${SOURCE_NAMESPACE} --export -o yaml | kubectl apply --namespace=${TARGET_NAMESPACE} -f -
done
