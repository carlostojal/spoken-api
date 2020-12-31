module.exports = {
  apps : [{
    name: "spoken-api",
    script: './src/app.js',
    watch: '.',
    instances: "max",
    exec_mode: "cluster"
  }],

  deploy : {
    production : {
      user : 'spokennetwork-adm',
      host : '192.168.1.73',
      ref  : 'origin/master',
      repo : 'git@github.com:carlostojal/spoken-api.git',
      path : '/home/spokennetwork-adm/spoken-api',
      "post-deploy": "npm install && pm2 reload --env production"
    }
  }
};
