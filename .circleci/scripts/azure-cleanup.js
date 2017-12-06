#!/usr/bin/env node

let run = require('./run');
let env = require('./env');

run(`az login -u ${env.AZURE_USER} -p ${env.AZURE_PASS}`);

// Remove Azure App Services built on already unexisting branches

run('git fetch --prune');
run('git remote set-head origin -d') // Remove origin/HEAD -> origin/master record in branches list
let remoteBranches = run(`git branch -r --no-color --list`)
  .trim()
  .split('\n')
  .map(str => str.replace('origin/', '').trim());

let webApps = JSON.parse(
  run(`az webapp list --resource-group ${env.AZURE_RESOURCE_GROUP}`)
);

let webAppsToDelete = webApps.filter(app => {
  return (
    app.tags.Repository === `${env.PROJECT_USERNAME}/${env.PROJECT_REPONAME}` &&
    remoteBranches.indexOf(app.tags.Branch) === -1
  );
});

console.log('--- Remote branches:', remoteBranches);
console.log('--- Web Apps all:', webApps.map(app => app.name));
console.log('--- Web Apps to delete:', webAppsToDelete.map(app => app.name));

if (webAppsToDelete.length) {
  run(`
    az webapp delete \
      --keep-empty-plan \
      --resource-group ${env.AZURE_RESOURCE_GROUP} \
      --ids ${webAppsToDelete.map(app => app.id).join(' ')}
  `);
}
