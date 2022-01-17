#!/usr/bin/env bash

set -eo pipefail

script_dir="$( cd "$( dirname "$BASH_SOURCE[0]" )" && pwd )"
project_root_dir=$( cd "$script_dir" && git rev-parse --show-toplevel )

log() {
  echo $1;
}

display_usage() {
  log "[$(basename $0)]"
  log "Usage:"
  log "$(basename $0) <command   # if you don't specify any commad(argument) then 'make' will be run
  log "Examples:"
  log "$(basename $0) bash                  # runs bash"
  log ""
  log "Required variables present in environment where script is executed:"
  log "- VAULT_ADDR"
  log "- AZURE_USER"
  log "- AZURE_PASS"
}

log_err() {
  log "[$(basename $0)] ERROR: $1"
  log ""
}

assert_vars() {
  for v in $@; do
    # if one of variables is empty
    if [[ -z "${!v}" ]]; then
      log_err "$v is empty"
      display_usage
      exit 1
    fi
  done
}

assert_vars VAULT_ADDR AZURE_USER AZURE_PASS

export VAULT_TOKEN=$(docker run opuscapita/minsk-core-machineuser-env:2 get-vault-token.sh --azure-user=$AZURE_USER --azure-pass=$AZURE_PASS --vault-addr=$VAULT_ADDR)

ci_docker_image="opuscapita/minsk-core-ci:deploy"

>&2 echo "[INFO] Pulling newest preconfigured Docker image '$ci_docker_image'"
>&2 docker pull "$ci_docker_image"

>&2 echo "[INFO] Start preconfigured Docker container"

docker run \
  --rm \
  -it \
  --workdir=/sources \
  -e VAULT_ADDR \
  -e VAULT_TOKEN \
  -v "$project_root_dir":/sources:delegated \
  "$ci_docker_image" bash -c "${*-bash}"
