#!/usr/bin/env node

let env = process.env;
let DOCKER_TAG = env.CIRCLE_BRANCH.replace('/', '-').replace('#', '-');

module.exports = {
  AZURE_APP_NAME: "opuscapita-filemanager-demo",
  AZURE_APP_SERVICE_PLAN: env.AZURE_APP_SERVICE_PLAN,
  AZURE_PASS: env.AZURE_PASS,
  AZURE_RESOURCE_GROUP: env.AZURE_RESOURCE_GROUP,
  AZURE_USER: env.AZURE_USER,
  BRANCH: env.CIRCLE_BRANCH,
  DOCKER_DEMO_CONTAINER_NAME: "opuscapita/filemanager-demo",
  DOCKER_PASS: env.DOCKER_PASS,
  DOCKER_TAG,
  DOCKER_USER: env.DOCKER_USER,
  PROJECT_REPONAME: env.CIRCLE_PROJECT_REPONAME,
  PROJECT_USERNAME: env.CIRCLE_PROJECT_USERNAME,

  API_KEY: env.API_KEY,
  CLIENT_ID: env.CLIENT_ID,
  SERVER_URL: `http://opuscapita-filemanager-demo-${DOCKER_TAG}.azurewebsites.net`
};

// http://opuscapita-filemanager-demo.azurewebsites.net
