'use strict';

require('dotenv').load();

var vantage = require('vantage')();

var _process$env = process.env;
var GITHUB_USERNAME = _process$env.GITHUB_USERNAME;
var GITHUB_PASSWORD = _process$env.GITHUB_PASSWORD;

var github = require('modules/github')({
  username: GITHUB_USERNAME,
  password: GITHUB_PASSWORD
});

vantage.command('apprenticeship members add <username>').action(function (params) {
  var _this = this;

  return github.apprenticeship.add(params.username).then(function () {
    return _this.log('Complete');
  })['catch'](function (err) {
    _this.log(err.message);
    _this.log('Please make sure you have the correct credentials on the .env file');
  });
});

vantage.delimiter('kraken~$').listen(4001).show();