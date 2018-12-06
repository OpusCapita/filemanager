#!/usr/bin/env bash

set -eo pipefail

display_usage() {
  printf "Expected commit message:\n"
  printf "Deploy master at 03d8ca021b306a26cbdea534085cc1edfbcdc36b   # <branch> and <commit SHA> to be deployed. Title is ignored by script.\n"
  printf "                                                            # empty line splits message into 'title' and 'body' parts\n"
  printf "[branch:master]                                             # branch which is deployed\n"
  printf "[commit:03d8ca021b306a26cbdea534085cc1edfbcdc36b]           # commit SHA which is deployed\n"
  printf "[docker_image_repository:username/something]                # docker image repository\n"
  printf "[docker_image_tag:3-10-GA-25]                               # docker image tag to be deployed\n"
}

# @param $1 - body of commit-trigger body which holds parameters of deployment
#             if no param specified - show usage and exit
if [ $# -lt 1 ]; then
  display_usage
  exit 1
fi

while read -r line
do
  [[ "$line" =~ ^\[([a-zA-Z_]+):(.+)\]$ ]]
  case "${BASH_REMATCH[1]}" in
    branch)
      BRANCH="${BASH_REMATCH[2]}"
      ;;
    commit)
      COMMIT="${BASH_REMATCH[2]}"
      ;;
    docker_image_repository)
      DOCKER_IMAGE_REPOSITORY="${BASH_REMATCH[2]}"
      ;;
    docker_image_tag)
      DOCKER_IMAGE_TAG="${BASH_REMATCH[2]}"
      ;;
    *)
      printf "Error: Invalid parameter ${BASH_REMATCH[1]}\n"
      display_usage
      exit 1
  esac
done < <(printf "$1\n")

printf "BRANCH: $BRANCH\n"
printf "COMMIT: $COMMIT\n"
printf "DOCKER_IMAGE_REPOSITORY: $DOCKER_IMAGE_REPOSITORY\n"
printf "DOCKER_IMAGE_TAG: $DOCKER_IMAGE_TAG\n"

if [ -z "$BRANCH" ] || [ -z "$COMMIT" ] || [ -z "$DOCKER_IMAGE_REPOSITORY" ] || [ -z "$DOCKER_IMAGE_TAG" ]; then
  echo "Error: missing required arguments!"
  display_usage
  exit 1
fi

echo "export BRANCH=${BRANCH}" >> ${BASH_ENV}
echo "export COMMIT=${COMMIT}" >> ${BASH_ENV}
echo "export DOCKER_IMAGE_REPOSITORY=${DOCKER_IMAGE_REPOSITORY}" >> ${BASH_ENV}
echo "export DOCKER_IMAGE_TAG=${DOCKER_IMAGE_TAG}" >> ${BASH_ENV}
