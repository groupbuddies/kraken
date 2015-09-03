'use strict';

require('dotenv').load();

var vantage = require('vantage')();

var key = require('../' + process.env.GOOGLE_KEY_FILENAME);
var _process$env = process.env;
var GITHUB_USERNAME = _process$env.GITHUB_USERNAME;
var GITHUB_PASSWORD = _process$env.GITHUB_PASSWORD;

var github = require('modules/github')({
  username: GITHUB_USERNAME,
  password: GITHUB_PASSWORD
});

var google = require('modules/google')(key);

vantage.command('apprenticeship members add <username>').action(function (params) {
  var _this = this;

  return github.apprenticeship.add(params.username).then(function () {
    return _this.log('Complete');
  })['catch'](function (err) {
    _this.log(err.message);
    _this.log('Please make sure you have the correct credentials on the .env file');
  });
});

vantage.command('google members add <name> <password>').action(function () {
  var _this2 = this;

  google.users.add().then(function () {
    return _this2.log('Complete');
  })['catch'](function (err) {
    return console.log(err, err.stack);
  });
});

vantage.delimiter('kraken~$').listen(4001).show();