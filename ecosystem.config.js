module.exports = {
  apps : [{
    name: "spoken-api",
    script: './src/app.js',
    watch: '.',
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "dev"
    },
    env_production: {
      NODE_ENV: "production"
    }
  }],

  deploy : {
    production : {
      user : 'spokennetwork-adm',
      host : '192.168.1.73',
      ref  : 'origin/master',
      repo : 'git@spoken_deployment:carlostojal/spoken-api.git',
      path : '/home/spokennetwork-adm/spoken-api',
      "post-deploy": "npm install && pm2 reload --env production"
    }
  }
};
