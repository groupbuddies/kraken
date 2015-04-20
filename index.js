#! /usr/bin/env node

var path = require('path');
var dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });

var program = require('commander');

var Application = require('./application');
var User = require('./utils/user');
var apprenticeship = require('./apprenticeship');

var Slack = require('./slack/index');
var Google = require('./google/index');
var Github = require('./github/index');

var exit = function() {
  process.exit();
};

program
  .version('0.0.1');

program
  .option('-d, --development', 'Enable development mode')
  .parse(process.argv);

if (program.development)
  Application.development = program.development;

program
  .command('slack <email> <firstName> <lastName>')
  .action(function(email, firstName, lastName) {
    var user = User.fromArguments(email, firstName, lastName);
    Slack.invite(user)
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

    Google.invite(user)
      .finally(exit);
  });

program
  .command('apprenticeship')
  .action(function() {
    apprenticeship();
  });

program.parse(process.argv);
