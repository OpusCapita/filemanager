#!/bin/sh
# ideas used from https://gist.github.com/motemen/8595451

# abort the script if there is a non-zero error
set -e
set -x

# show where we are on the machine
pwd

BASEDIR=$(dirname "$0")
SITE_SOURCE="$1"

if [ ! -d "$SITE_SOURCE" ]
then
    echo "Usage: $0 <site source dir>"
    exit 1
fi

# get current git branch name
GIT_BRANCH=`git rev-parse --abbrev-ref HEAD`

# replace "/", "#", etc. in current git branch name
urlencode() {
  node -e "console.log('${*}'.replace('/', '(slash)').replace('#', '(hash)'))"
}

SAFE_GIT_BRANCH=`urlencode $GIT_BRANCH`
echo "Current branch is $SAFE_GIT_BRANCH"

# now lets setup a new repo so we can update the gh-pages branch
git config --global user.email "$GH_EMAIL" > /dev/null 2>&1
git config --global user.name "$GH_NAME" > /dev/null 2>&1

# switch into the the gh-pages branch
if git rev-parse --verify origin/gh-pages > /dev/null 2>&1
then
    git checkout gh-pages
    git pull
else
    git checkout --orphan gh-pages
fi

# delete any old site as we are going to replace it
rm -rf "./branches/$SAFE_GIT_BRANCH"
mkdir -p "./branches/$SAFE_GIT_BRANCH"

# copy over or recompile the new site
cp -r ./$SITE_SOURCE/* "./branches/$SAFE_GIT_BRANCH"

# stage any changes and new files
git add -A
# now commit, ignoring branch gh-pages doesn't seem to work, so trying skip
git commit --allow-empty -m "Deploy to GitHub pages [ci skip]"
# and push, but send any output to /dev/null to hide anything sensitive
git push --force --quiet origin gh-pages > /dev/null 2>&1

echo "Finished Deployment!"
