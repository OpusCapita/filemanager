'use strict';

module.exports = {
  HOST: process.env.HOST ? process.env.HOST : 'localhost',
  PORT: process.env.PORT ? process.env.PORT : 3000,
  SERVER_URL: process.env.SERVER_URL ? process.env.SERVER_URL : 'http://localhost:3020',

  CLIENT_ID: process.env.CLIENT_ID,
  API_SECRET: process.env.API_SECRET,
  API_KEY: process.env.API_KEY
};
