var options = {
  default: {
    workspace: '/tmp/kraken',
    deployTo: '/apps/kraken',
    branch: 'v2',
    repositoryUrl: 'git@github.com:subvisual/kraken.git',
    keepReleases: 2,
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

  shipit.initConfig(options);

  shipit.task('pwd', function () {
    return shipit.remote('ls -a');
  });
};
