'use strict';

module.exports = {
  HOST: process.env.HOST ? process.env.HOST : 'localhost',
  PORT: process.env.PORT ? process.env.PORT : 3000,
  BASE_URL: process.env.BASE_URL ? process.env.BASE_URL : '',
  SERVER_URL: process.env.SERVER_URL ? process.env.SERVER_URL : `http://${HOST}:${PORT}${BASE_URL}`,

  CLIENT_ID: process.env.CLIENT_ID,
  API_SECRET: process.env.API_SECRET,
  API_KEY: process.env.API_KEY
};
