#!/usr/bin/env node

let run = require('./run');
let env = require('./env');

run(`docker build -f Dockerfile.demo -t ${env.DOCKER_DEMO_CONTAINER_NAME}:${env.DOCKER_TAG} .`, true);
run(`docker login -u ${env.DOCKER_USER} -p ${env.DOCKER_PASS}`);
run(`docker push ${env.DOCKER_DEMO_CONTAINER_NAME}:${env.DOCKER_TAG}`, true);
