#!/usr/bin/env node

let run = require('./run');

run(`
  mkdir /vault &&
  git clone git@github.com:OpusCapita/machineuser-vault.git /vault
`);

run(`
  cd /vault &&
  openssl aes-256-cbc -d -in .secrets -out .secrets-plain -k ${process.env.MACHINEUSER_VAULT_KEY}
`);

run(`echo "source /vault/.secrets-plain" >> ${process.env.CIRCLE_SHELL_ENV}`);
