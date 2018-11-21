#!/usr/bin/env bash

set -e

echo "cluster-login.sh"

while [ $# -gt 0 ]; do
  case "$1" in
    --azure-user=*)
      AZURE_USER="${1#*=}"
      ;;
    --azure-pass=*)
      AZURE_PASS="${1#*=}"
      ;;
    --subscription=*)
      SUBSCRIPTION_ID="${1#*=}"
      ;;
    --azure-rg=*)
      AZURE_RG="${1#*=}"
      ;;
    --cluster-name=*)
      CLUSTER_NAME="${1#*=}"
      ;;
    *)
      printf "Error: Invalid argument ${1}\n"
      exit 1
  esac
  shift
done

if [ -z "$AZURE_USER" ] || [ -z "$AZURE_PASS" ] || [ -z "$SUBSCRIPTION_ID" ] || [ -z "$AZURE_RG" ] || [ -z "$CLUSTER_NAME" ]; then
  echo "Error: missing required arguments! See output above."
  exit 1
fi

# login to azure
az login -u "$AZURE_USER" -p "$AZURE_PASS" &> /tmp/az-login.log
# use Minsk Core subscription
az account set -s "$SUBSCRIPTION_ID"
# access Minsk Core cluster
az aks get-credentials -n "$CLUSTER_NAME" -g "$AZURE_RG"
