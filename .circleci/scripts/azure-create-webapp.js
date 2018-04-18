#!/usr/bin/env node

let run = require('./run');
let env = require('./env');

run(`az login -u ${env.AZURE_USER} -p "${env.AZURE_PASS}"`);

// Create Azure Web App

let resource = JSON.parse(
  run(`
    az webapp create \
      --plan ${env.AZURE_APP_SERVICE_PLAN} \
      --resource-group ${env.AZURE_RESOURCE_GROUP} \
      --deployment-container-image-name ${env.DOCKER_DEMO_CONTAINER_NAME}:${env.DOCKER_TAG} \
      --name ${env.SUBDOMAIN} \
  `)
);

console.log('--- New Azure App Service ID:', resource.id);

// Set tags for easier maintaince

run(`
  az resource tag \
    --ids '${resource.id}' \
    --tags Repository=${env.PROJECT_USERNAME}/${env.PROJECT_REPONAME} Branch=${env.BRANCH} Demo=true \
`);

// Enable continuous deployment

run(`
  az webapp deployment container config \
    --ids '${resource.id}' \
    --enable-cd true
`);

let azureAppWebhookUrl = JSON.parse(
  run(`az webapp deployment container show-cd-url --ids '${resource.id}'`)
).CI_CD_URL;

console.log('--- Continuous deployment Webhook URL:', azureAppWebhookUrl);

// Docker hub login

let dockerHubLoginToken = JSON.parse(
  run(`
    http --ignore-stdin \
    POST \
    https://hub.docker.com/v2/users/login \
    username=${env.DOCKER_USER} \
    password=${env.DOCKER_PASS}
  `)
).token;

// Create webhook

let dockerHubWebhooks = JSON.parse(
  run(`
    http --ignore-stdin \
    GET \
    https://hub.docker.com/v2/repositories/${env.DOCKER_DEMO_CONTAINER_NAME}/webhooks/ \
    "Authorization: JWT ${dockerHubLoginToken}"
  `)
).results;

console.log('--- Docker Hub Webhooks:', JSON.stringify(dockerHubWebhooks, null, 4));

let dockerHubWebHookExists = !!dockerHubWebhooks.filter(hook => hook.name === 'azure-cd').length

let dockerHubWebhookId = dockerHubWebHookExists ?
  dockerHubWebhooks.filter(hook => hook.name === 'azure-cd')[0].id :
  JSON.parse(
    run(`
      http --ignore-stdin \
      POST \
      https://hub.docker.com/v2/repositories/${env.DOCKER_DEMO_CONTAINER_NAME}/webhooks/ \
      "Authorization: JWT ${dockerHubLoginToken}" \
      name=azure-cd
    `)
  ).id;

console.log('--- Docker Hub WebhookId:', dockerHubWebhookId);

run(`
  http --ignore-stdin \
  POST \
  https://hub.docker.com/v2/repositories/${env.DOCKER_DEMO_CONTAINER_NAME}/webhooks/${dockerHubWebhookId}/hooks/ \
  "Authorization: JWT ${dockerHubLoginToken}" \
  hook_url=${azureAppWebhookUrl}
`);

// Set Azure App Service "Application Settings"

run(`
 az webapp config appsettings set \
   --ids '${resource.id}' \
   --settings \
     HOST=0.0.0.0 \
     DOCKER_ENABLE_CI=true \
     CLIENT_ID=${env.CLIENT_ID} \
     API_KEY=${env.API_KEY} \
     SERVER_URL=${env.SERVER_URL}
`);
