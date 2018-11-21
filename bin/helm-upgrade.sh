#!/usr/bin/env bash

#
# Run `helm upgrade` with specified options
#

set -e

echo "helm-upgrade.sh"

working_directory="$( pwd )"

script_dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

while [ $# -gt 0 ]; do
  case "$1" in
    --chart-path=*)
      CHART_PATH="${1#*=}"
      ;;
    --values-template=*)
      VALUES_TEMPLATE="${1#*=}"
      ;;
    --namespace=*)
      NAMESPACE="${1#*=}"
      ;;
    --release-name=*)
      RELEASE_NAME="${1#*=}"
      ;;
    *)
      printf "Error: Invalid argument ${1}\n"
      exit 1
  esac
  shift
done

echo "CHART_PATH: ${CHART_PATH}"
echo "VALUES_TEMPLATE: ${VALUES_TEMPLATE}"
echo "NAMESPACE: ${NAMESPACE}"
echo "RELEASE_NAME: ${RELEASE_NAME}"

if [ -z "$CHART_PATH" ] || [ -z "$VALUES_TEMPLATE" ] || [ -z "$NAMESPACE" ] || [ -z "$RELEASE_NAME" ]; then
  echo "Error: missing required arguments! See output above."
  exit 1
fi

VALUES_FILE=$( mktemp )

# interpolate env variables in template
eval "cat <<EOF
$(<$VALUES_TEMPLATE)
EOF
" 2>/dev/null 1>"${VALUES_FILE}"

# configure $HELM_HOME
helm init --client-only

# put Helm dependencies into correct folder
cd $CHART_PATH
helm dependency update

# install/update release
helm upgrade \
  --install \
  --force \
  --values $VALUES_FILE \
  --namespace $NAMESPACE \
  $RELEASE_NAME \
  .

# restore working directory to initial pwd
cd $working_directory
