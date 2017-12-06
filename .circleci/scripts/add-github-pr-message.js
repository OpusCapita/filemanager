#!/usr/bin/env node

let run = require('./run');
let env = require('./env');

let pullRequests = JSON.parse(
  run(`http GET https://api.github.com/repos/${env.PROJECT_USERNAME}/${env.PROJECT_REPONAME}/pulls`)
).filter(pr => pr.head.ref === env.BRANCH);

console.log('--- Branch related PRs:', pullRequests);

let targets = pullRequests.map(pr => pr.head.sha);

console.log('--- Add status message to these commits:', targets);

targets.forEach(target => {
  run(`
    http --ignore-stdin \
    POST \
    https://api.github.com/repos/${env.PROJECT_USERNAME}/${env.PROJECT_REPONAME}/statuses/${target} \
    Authorization:"token 5056b950e67c0d8e219750caee3b382f0091cf6e" \
    state="success" \
    target_url="${`http://opuscapita-filemanager-demo-${env.DOCKER_TAG}.azurewebsites.net`}" \
    description="Test status" \
    context="ci/demo-deploy"
  `);
});

console.log('prs:', targets);
