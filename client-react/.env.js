'use strict';

module.exports = {
  HOST: process.env.HOST ? process.env.HOST : 'localhost',
  PORT: process.env.PORT ? process.env.PORT : 3000,
  SERVER_URL: 'http://localhost:3020',
  GOOGLE_DRIVE_FILEMANAGER_ID: process.env.GOOGLE_DRIVE_FILEMANAGER_ID,
  GOOGLE_DRIVE_FILEMANAGER_SECRET: process.env.GOOGLE_DRIVE_FILEMANAGER_SECRET,
  GOOGLE_DRIVE_FILEMANAGER_API_KEY: process.env.GOOGLE_DRIVE_FILEMANAGER_API_KEY
};
