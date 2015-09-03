require('dotenv').load();

var vantage = require('vantage')();

var key = require(`../${process.env.GOOGLE_KEY_FILENAME}`);
var { GITHUB_USERNAME, GITHUB_PASSWORD } = process.env;

var github = require('modules/github')({
  username: GITHUB_USERNAME,
  password: GITHUB_PASSWORD
});

var google = require('modules/google')(key);

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
  .command('google members add <name> <password>')
  .action(function() {
    google.users.add()
      .then(() => this.log('Complete'))
      .catch((err) => console.log(err, err.stack));
  });

vantage
  .delimiter('kraken~$')
  .listen(4001)
  .show();
