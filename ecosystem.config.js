/** PM2: Un solo backend que sirve ambos frontends (ecommerce + admin) */
module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: '/app/barber-backend',
      script: 'dist/src/main.js',
      env: {
        NODE_ENV: 'production',
        PORT: '4000',
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://mongodb:27017/sosabarber',
      },
    },
  ],
};
