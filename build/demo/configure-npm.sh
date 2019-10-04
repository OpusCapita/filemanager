#!/usr/bin/env bash

set -eo pipefail

echo "[INFO] Configure npm"

if [ ! -f /.dockerenv ]; then
  echo "[WARNING] Skipping $(basename $0) execution, it will be run only inside Docker container because it can override local user's settings"
fi

if [ -f /.dockerenv ]; then
  # Get values required by ~/.npmrc
  NPM_DEFAULT_REGISTRY=$( vault kv get -field=value machineuser/NPM_DEFAULT_REGISTRY )
  NPM_DEFAULT_REGISTRY_AUTH=$( vault kv get -field=value machineuser/NPM_DEFAULT_REGISTRY_AUTH )
  NPM_DEFAULT_REGISTRY_MAIL=$( vault kv get -field=value machineuser/NPM_DEFAULT_REGISTRY_MAIL )
  NPMJS_ORG_AUTH=$( vault kv get -field=value machineuser/NPMJS_ORG_AUTH )

  export NPM_DEFAULT_REGISTRY=$NPM_DEFAULT_REGISTRY
  export NPM_DEFAULT_REGISTRY_AUTH=$NPM_DEFAULT_REGISTRY_AUTH
  export NPM_DEFAULT_REGISTRY_MAIL=$NPM_DEFAULT_REGISTRY_MAIL
  export NPMJS_ORG_AUTH=$NPMJS_ORG_AUTH
fi
