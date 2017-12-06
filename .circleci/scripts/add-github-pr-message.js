#!/usr/bin/env node

let run = require('./run');
let env = require('./env');

let pullRequests = JSON.parse(
  run(`http GET https://api.github.com/repos/${env.PROJECT_USERNAME}/${env.PROJECT_REPONAME}/pulls`)
).filter(pr => pr.head.ref === env.BRANCH);

console.log('--- Branch related PRs:', JSON.stringify(pullRequests, null, 4));

let targets = pullRequests.map(pr => pr.head.sha);

console.log('--- Add status message to these commits:', JSON.stringify(targets, null, 4));


targets.forEach(target => {
  run(`
    http --ignore-stdin --auth ${env.GH_NAME}:${env.GH_PASS} \
    POST \
    https://api.github.com/repos/${env.PROJECT_USERNAME}/${env.PROJECT_REPONAME}/statuses/${target} \
    state="success" \
    target_url="http://opuscapita-filemanager-demo-${env.DOCKER_TAG}.azurewebsites.net" \
    description="Test status" \
    context="ci/demo-deploy"
  `);
});
