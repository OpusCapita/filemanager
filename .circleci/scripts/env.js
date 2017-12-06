#!/usr/bin/env node

let env = process.env;
let DOCKER_TAG = env.CIRCLE_BRANCH.replace('/', '-').replace('#', '-');

console.log('--- env.GH_MAIL', env.GH_MAIL);
console.log('whoami', require('./run')('whoami'));
console.log('shell', require('./run')('env | grep SHELL'));

module.exports = {
  AZURE_APP_NAME: "opuscapita-filemanager-demo",
  AZURE_APP_SERVICE_PLAN: env.AZURE_APP_SERVICE_PLAN,
  AZURE_PASS: env.AZURE_PASS,
  AZURE_RESOURCE_GROUP: env.MINSK_CORE_DEMO_AZURE_RESOURCE_GROUP,
  AZURE_USER: env.AZURE_USER,
  BRANCH: env.CIRCLE_BRANCH,
  DOCKER_DEMO_CONTAINER_NAME: "opuscapita/filemanager-demo",
  DOCKER_PASS: env.DOCKER_PASS,
  DOCKER_TAG,
  DOCKER_USER: env.DOCKER_USER,
  GH_NAME: env.GH_NAME,
  GH_MAIL: env.GH_MAIL,
  GH_PASS: env.GH_PASS,
  PROJECT_REPONAME: env.CIRCLE_PROJECT_REPONAME,
  PROJECT_USERNAME: env.CIRCLE_PROJECT_USERNAME,

  API_KEY: env.MINSK_CORE_DEMO_GOOGLE_DRIVE_API_KEY,
  CLIENT_ID: env.MINSK_CORE_DEMO_GOOGLE_DRIVE_CLIENT_ID,
  CHANGELOG_GITHUB_TOKEN: env.MINSK_CORE_DEMO_CHANGELOG_GITHUB_TOKEN,
  SERVER_URL: `http://opuscapita-filemanager-demo-${DOCKER_TAG}.azurewebsites.net`
};
