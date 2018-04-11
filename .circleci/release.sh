#!/bin/bash

GIT_API_REPO_URL="https://api.github.com/repos/OpusCapita/"$CIRCLE_PROJECT_REPONAME""

push() {
    echo -e "\n[INFO] ================================================================================================="
    echo "[INFO] Pushing changes to origin."
    echo "[INFO] ================================================================================================="
    git push --set-upstream origin ${RELEASE_BRANCH} --tags
}

grails_version() {
    echo -e "\n[INFO] ================================================================================================="
    echo "[INFO] Grails: Updating version to: $1."
    echo "[INFO] ================================================================================================="
    find . -type f -name "application.properties" -exec sed -i 's/app.version=.*/app.version='$1'/g' {} \;
    find . -type f -name "*GrailsPlugin.groovy" -exec sed -i 's/def version =.*/def version = "'$1'"/g' {} \;
    git --no-pager diff --color
}

maven_version() {
    echo -e "\n[INFO] ================================================================================================="
    echo "[INFO] Maven: Updating to release version: $1."
    echo "[INFO] ================================================================================================="
    current_version=$(xmllint --xpath '/*[local-name()="project"]/*[local-name()="version"]/text()' pom.xml)
    find . -type f -name "pom.xml" -exec sed -i 's/'$current_version'/'$1'/g' {} \;
    git --no-pager diff --color
}

node_version() {
    echo -e "\n[INFO] ================================================================================================="
    echo "[INFO] NodeJS: Updating to release version: $1."
    echo "[INFO] ================================================================================================="
    find . -type f -name "lerna.json" -exec sed -i 's|\"version.*\"|\"version\": \"'$1'\"|g' {} \;
    find . -type f -name "package.json" -exec sed -i 's|\"version.*\"|\"version\": \"'$1'\"|g' {} \;
    find . -type f -name "package.json" -exec sed -i 's|\"@opuscapita/react-filemanager-connector-google-drive-v2\".*\"|\"@opuscapita/react-filemanager-connector-google-drive-v2\": \"'$1'\"|g' {} \;
    find . -type f -name "package.json" -exec sed -i 's|\"@opuscapita/react-filemanager-connector-node-v1\".*\"|\"@opuscapita/react-filemanager-connector-node-v1\": \"'$1'\"|g' {} \;
    git --no-pager diff --color
}

creating_milestone(){
    REPO_URL="$GIT_API_REPO_URL/milestones"
    TITLE="Releasing\u0020version\u0020-\u0020$RELEASE_VERSION"
    DUE_DATE=$(date "+%FT%TZ")

    echo -e "\n[INFO] ================================================================================================="
    echo "[INFO] Creating milestone: \"$RELEASE_VERSION\"."
    echo "[INFO] ================================================================================================="

    MILESTONE=$(curl -sS --user "$GH_NAME:$GH_TOKEN" -X POST -w "%{http_code}" -o /dev/null --data \
    '{"title":"'${RELEASE_VERSION}'","description":"'${TITLE}'","due_on":"'${DUE_DATE}'"}' $REPO_URL)

    if [ $MILESTONE == 201 ]; then
        printf "[INFO] Milestone \"$RELEASE_VERSION\" successfully created.\n"
    elif [ $MILESTONE == 422 ]; then
        printf "[ERROR] Milestone \"$RELEASE_VERSION\" already exist or bad request.\n"
    else
        printf "[ERROR] Failed to create milestone \"v$RELEASE_VERSION\".\n"
        curl -sS --user "$GH_NAME:$GH_TOKEN" -X POST -w "%{http_code}" --data \
        '{"title":"'${RELEASE_VERSION}'","description":"'${TITLE}',"due_on":"'${DUE_DATE}'"}' $REPO_URL
        echo "[INFO] Json request: {"title":"v'${RELEASE_VERSION}'","description":"'${TITLE}'","due_on":"'${DUE_DATE}'"}"
    fi
}

creating_github_release(){
    REPO_URL="$GIT_API_REPO_URL/releases"
    GIT_TAG_HASH=$(git rev-list --tags --max-count=1)
    GIT_TAG_NAME=$(git describe --tags ${GIT_TAG_HASH})
    GIT_TAG_VERSION=$(echo $GIT_TAG_NAME | sed 's/^v//')
    README_URL="https://github.com/OpusCapita/"$CIRCLE_PROJECT_REPONAME"/blob/"$GIT_TAG_HASH"/CHANGELOG.md"
    MILESTONE_URL=$(curl -sS --user "$GH_NAME:$GH_TOKEN" "${GIT_API_REPO_URL}/milestones" \
        | jq -r '.[] | select(.title == "'$GIT_TAG_VERSION'" ) | .html_url')
    DRAFT_BODY="See\u0020[changelog]($README_URL)\u0020and\u0020[completed\u0020issues]($MILESTONE_URL?closed=1)"

    echo -e "\n[INFO] ================================================================================================="
    echo "[INFO] Creating draft for GitHub release: \"$RELEASE_VERSION\"."
    echo "[INFO] ================================================================================================="

    GITHUB_RELEASE=$(curl -sS --user "$GH_NAME:$GH_TOKEN" -X POST -w "%{http_code}" -o /dev/null --data \
    '{"tag_name": "v'${RELEASE_VERSION}'","name": "'${RELEASE_VERSION}'","body": "'${DRAFT_BODY}'"}' \
    $REPO_URL)

    if [ $GITHUB_RELEASE == 201 ]; then
        printf "[INFO] Draft for \"v$RELEASE_VERSION\" successfully created.\n"
    else
        printf "[ERROR] Failed to create draft for release: \"$RELEASE_VERSION\".\n"
        curl -sS --user "$GH_NAME:$GH_TOKEN" -X POST -w "%{http_code}" --data \
        '{"tag_name": "v'${RELEASE_VERSION}'","name": "v'${RELEASE_VERSION}'"}' $REPO_URL
        echo "[INFO] Json request: {"tag_name": v"${RELEASE_VERSION}","name": "${RELEASE_VERSION}", \
"body": "${DRAFT_BODY}"}"
    fi

}

########################################## Script initialization #################################################
echo "[INFO] ================================================================================================="
echo "[INFO] Starting release script."
echo "[INFO] ================================================================================================="
echo "[INFO] Getting arguments from commit message."
echo "[INFO] ================================================================================================="
COMMIT=$(git log -1 --pretty=%s | sed -r 's/\[|\]//g')
echo "[INFO] Release commit: \"${COMMIT}\"."

IFS=':' read -a params <<< "${COMMIT}"
unset IFS

if [ "${#params[@]}" -ne 4 ]; then
  echo "[ERROR] Incorrect release commit!"
  exit 1
fi

echo "[INFO] Branch for release: ${params[1]}."
export RELEASE_BRANCH=${params[1]}
echo "[INFO] Release version: ${params[2]}."
export RELEASE_VERSION=${params[2]}
echo "[INFO] Next snapshot version: ${params[3]}."
export SNAPSHOT_VERSION=${params[3]}

echo -e "\n[INFO] ================================================================================================="
echo "[INFO] Setting git user attributes."
echo "[INFO] ================================================================================================="
git config --global user.name "$(git log -1 --pretty=%an)"
if [ -z "$(git config --global user.name)" ]; then
  echo "[ERROR] Undefined git user name."
  exit 1
else
  echo "[INFO] User name: $(git config user.name)"
fi

git config --global user.email $(git log -1 --pretty=%ae)
if [ -z "$(git config --global user.email)" ]; then
  echo "[ERROR] Undefined git user email address."
  exit 1
else
  echo "[INFO] User email: $(git config user.email)"
fi

echo -e "\n[INFO] ================================================================================================="
echo "[INFO] Checkout for release branch: ${RELEASE_BRANCH}."
echo "[INFO] ================================================================================================="
git clone "$CIRCLE_REPOSITORY_URL" -b "${RELEASE_BRANCH}" "$CIRCLE_PROJECT_REPONAME_$CIRCLE_JOB"
cd "$CIRCLE_PROJECT_REPONAME_$CIRCLE_JOB"
git checkout "${RELEASE_BRANCH}"
git pull origin "${RELEASE_BRANCH}"
echo "[INFO] Current branch: $(git rev-parse --abbrev-ref HEAD)"

echo -e "\n[INFO] ================================================================================================="
echo "[INFO] Generating changelog."
echo "[INFO] ================================================================================================="
groovy /bin/changelogUpdate.groovy "${RELEASE_VERSION}" "${RELEASE_BRANCH}"

node_version "${RELEASE_VERSION}"

echo -e "\n[INFO] ================================================================================================="
echo "[INFO] Committing changes."
echo "[INFO] ================================================================================================="
git commit -am "Releasing version - $RELEASE_VERSION. [ci skip]"
echo -e "\n[INFO] ================================================================================================="
echo "[INFO] Adding git tag: ${RELEASE_VERSION}."
echo "[INFO] ================================================================================================="
git tag v${RELEASE_VERSION}
if [ "$?" != 0 ]; then
  echo "[ERROR] Tag error!"
  exit 1
fi

push

creating_milestone

creating_github_release

node_version ${SNAPSHOT_VERSION}
echo -e "\n[INFO] ================================================================================================="
echo "[INFO] Committing changes."
echo "[INFO] ================================================================================================="
git commit -am "Advancing project version to the next development - $SNAPSHOT_VERSION. [ci skip]"
push
