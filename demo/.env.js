'use strict';

const HOST = process.env.HOST ? process.env.HOST : 'localhost';
const PORT = process.env.PORT ? process.env.PORT : 3000;
const BASE_URL = process.env.BASE_URL ? process.env.BASE_URL : '';
const SERVER_HOST = process.env.SERVER_HOST ? process.env.SERVER_HOST : 'localhost';
const SERVER_URL = process.env.SERVER_URL ?
  process.env.SERVER_URL :
  process.env.SERVER_HOST ?
    `https://${SERVER_HOST}${BASE_URL}` :
    `http://${HOST}:${PORT}${BASE_URL}`;


module.exports = {
  HOST,
  PORT,
  BASE_URL,
  SERVER_URL,

  CLIENT_ID: process.env.CLIENT_ID,
  API_SECRET: process.env.API_SECRET,
  API_KEY: process.env.API_KEY
};
