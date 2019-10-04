#!/usr/bin/env bash

set -eo pipefail
script_dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

# Get Github repository '<owner>/<name>' string and convert all characters to lower case
echo $( $script_dir/../get-github-repo-owner-slash-name.sh | tr '[:upper:]' '[:lower:]' )
