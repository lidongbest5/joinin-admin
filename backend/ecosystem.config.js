module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // First application
    {
      name      : 'joinin',
      script    : './index.js',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
