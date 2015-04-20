var Application = require('../application');
var logger = require('../logger');
var Q = require('q');
var R = require('ramda');
var child_process = require('child_process');
var webdriver = require('selenium-webdriver');

var By = webdriver.By;
var until = webdriver.until;

var URI = {
  slack: 'https://groupbuddies.slack.com',
  slackInvites: 'https://groupbuddies.slack.com/admin/invites/full'
};

var verifyDependencies = function() {
  return new Q.Promise(function(resolve, reject) {
    child_process.exec('chromedriver -v', function(err) {
      if (err) {
        var errorMsg = 'It appears chromedriver is not installed. ' +
          'Please install "chromedriver" and try again.\n' +
          'If you\'re using Homebre you can run "brew install chromedriver".';

        logger.fatal(errorMsg);
        reject();
      } else {
        resolve();
      }
    });
  });
};

var login = function(browser) {
  browser.findElement(By.id('email')).sendKeys(process.env.SLACK_EMAIL);
  browser.findElement(By.id('password')).sendKeys(process.env.SLACK_PASSWORD);
  browser.findElement(By.id('signin_btn')).click();
  return browser;
};

var fillUserInformation = function(user, browser) {
  return browser
    .wait(until.elementLocated(By.name('email_address')), 3 * 1000)
    .then(function() {
      browser.findElement(By.name('email_address')).sendKeys(user.email);
      browser.findElement(By.name('first_name')).sendKeys(user.firstName);
      browser.findElement(By.name('last_name')).sendKeys(user.lastName);
    });
};

var successMessage = function() {
  logger.info('There is a new chrome window open,'
              + ' go there and finish the invitation process.');
};

var errorMessage = function(err) {
  logger.falat(err);
  throw err;
};

module.exports = function(user) {
  logger.log('info', 'slack details', user);

  return verifyDependencies()
    .then(function() {
      return new webdriver.Builder().forBrowser('chrome').build();
    })
    .then(R.tap(R.invoke('get', [URI.slack])))
    .then(login)
    .then(R.tap(R.invoke('get', [URI.slackInvites])))
    .then(R.curry(fillUserInformation)(user))
    .then(successMessage)
    .catch(errorMessage);
};
