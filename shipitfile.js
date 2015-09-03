var path = require('path2/posix');

var options = {
  default: {
    workspace: '/tmp/kraken',
    deployTo: '/apps/kraken',
    branch: 'v2',
    repositoryUrl: 'git@github.com:subvisual/kraken.git',
    keepReleases: 2,
    shared: {
      files: [ 'kraken.json', '.env' ]
    },
    pm2: {
      json: path.join(shipit.config.deployTo, 'current', 'pm2.json')
    }
  },
  npm: {
    remote: true
  },
  vagrant: {
    servers: 'deploy@127.0.0.1:2222'
  }
};

module.exports = function(shipit) {
  require('shipit-deploy')(shipit);
  require('shipit-npm')(shipit);
  require('shipit-shared')(shipit);
  require('shipit-pm2')(shipit);

  shipit.initConfig(options);

  shipit.task('pwd', function () {
    return shipit.remote('ls -a');
  });
};
