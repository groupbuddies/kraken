#! /usr/bin/env node

var path = require('path');
var dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });

var logger = require('./logger');
var program = require('commander');

var slack = require('./services/slack');
var github = require('./services/github');
var google = require('./services/google');

program
  .version('0.0.1');

program
  .command('slack <email> <firstName> <lastName>')
  .action(function(email, firstName, lastName) {
    slack(email, firstName, lastName);
  });

program
  .command('github <username>')
  .action(function(username) {
    github(username);
  });

program
  .command('google <email> <firstName> <lastName>')
  .action(google);

program.parse(process.argv);
