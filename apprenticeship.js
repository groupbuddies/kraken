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

module.exports = function() {
  var Slack = require('./slack/index');
  var Google = require('./google/index');
  var Github = require('./github/index');

  inquirer.prompt(questions, function(answers) {
    Github.addApprentice(answers.githubUsername)
      .then(function() {
        return Google.invite(answers);
      })
      .then(function() {
        return Slack.invite(answers);
      })
      .finally(function() {
        process.exit();
      });
  });
};
