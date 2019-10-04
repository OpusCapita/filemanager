#!/usr/bin/env bash

set -eo pipefail
script_dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

repo_owner_and_name=$($script_dir/get-github-repo-owner-slash-name.sh)

if [[ $repo_owner_and_name == */* ]] ; then
  echo $repo_owner_and_name | sed 's/^.*\///'
else
  ehco "'$repo_owner_and_name' does not meet expectation to be a text like this: '<owner>/<name>'"
  exit 1
fi
