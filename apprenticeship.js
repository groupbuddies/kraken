var R = require('ramda');
var inquirer = require('inquirer');

var questions = [
  {
    type: 'input',
    name: 'email',
    message: 'Company Email (ex: bot@groupbuddies.com)'
  },
  {
    type: 'input',
    name: 'firstName',
    message: 'First Name'
  },
  {
    type: 'input',
    name: 'lastName',
    message: 'Last Name'
  },
  {
    type: 'input',
    name: 'githubUsername',
    message: 'Github username'
  }
];

module.exports = function(options) {
  var inviteToSlack = require('./services/slack');
  var inviteToGoogle = require('./services/google');
  var Github = require('./github/index');

  inquirer.prompt(questions, function(answers) {
    Github.addApprentice(answers.githubUsername)
      .then(function() {
        inviteToGoogle(answers, options);
      })
      .then(function() {
        inviteToSlack(answers, options);
      })
      .finally(function() {
        process.exit();
      });
  });
};
