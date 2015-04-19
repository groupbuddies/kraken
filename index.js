#! /usr/bin/env node

var path = require('path');
var dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });

var logger = require('./logger');
var program = require('commander');
var Promise = require('promise');

var slack = require('./services/slack');
var Google = require('./google/index');
var Github = require('./github/index');

var apprenticeship = require('./apprenticeship');

var User = require('./utils/user');

var exit = function() {
  process.exit();
};

var programOptions = function() {
  var options = {};

  if (program.forceSuccess)
    options.forceSuccess = program.forceSuccess;

  return options;
};

program
  .version('0.0.1');

program
  .option('-f, --force-success', 'Simulate success responses');

program
  .command('slack <email> <firstName> <lastName>')
  .action(function(email, firstName, lastName) {
    var user = User.fromArguments(email, firstName, lastName);
    slack(user)
      .finally(exit);
  });

program
  .command('github <username>')
  .action(function(username) {
    Github.addApprentice(username)
      .finally(exit);
  });

program
  .command('google <email> <firstName> <lastName>')
  .action(function(email, firstName, lastName) {
    var user = User.fromArguments(email, firstName, lastName);

    Google.createAccount(user)
      .finally(exit);
  });

program
  .command('apprenticeship')
  .action(function() {
    apprenticeship(programOptions());
  });

program.parse(process.argv);
