require('dotenv').load();

var vantage = require('vantage')();

var { GITHUB_USERNAME, GITHUB_PASSWORD } = process.env;

var github = require('modules/github')({
  username: GITHUB_USERNAME,
  password: GITHUB_PASSWORD
});

vantage
  .command('apprenticeship members add <username>')
  .action(function(params) {
    return github.apprenticeship.add(params.username)
      .then(() => this.log('Complete') )
      .catch((err) => {
        this.log(err.message);
        this.log('Please make sure you have the correct credentials on the .env file');
      });
  });

vantage
  .delimiter('kraken~$')
  .listen(4001)
  .show();
