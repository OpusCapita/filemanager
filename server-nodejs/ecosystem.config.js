module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    // Server application
    {
      name      : 'filemanager-nodejs-server',
      script    : 'index.js',
      watch: ['.'],
      ignore_watch : ['node_modules'],
      env_production : {
        NODE_ENV: 'development'
      }
    }
  ]
};
