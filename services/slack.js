var logger = require('../logger');
var Promise = require('promise');
var child_process = require('child_process');
var webdriver = require('selenium-webdriver');

var By = webdriver.By;

var URI = {
  slack: 'https://groupbuddies.slack.com',
  slackInvites: 'https://groupbuddies.slack.com/admin/invites/full'
};

var verifyDependencies = function() {
  return new Promise(function(resolve, reject) {
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
};

var fillUserInformation = function(browser, email, firstName, lastName) {
  browser.findElement(By.name('email_address')).sendKeys(email);
  browser.findElement(By.name('first_name')).sendKeys(firstName);
  browser.findElement(By.name('last_name')).sendKeys(lastName);
};

module.exports = function(email, firstName, lastName) {
  logger.log('info', 'slack details: %s %s <%s>', firstName, lastName, email);

  return verifyDependencies()
    .then(function() {
      var browser = new webdriver.Builder()
        .forBrowser('chrome')
        .build();

      browser.get(URI.slack);
      login(browser);
      browser.get(URI.slackInvites);
      fillUserInformation(browser, email, firstName, lastName);
      //browser.findElement(By.css('.api_send_invites')).click();
    });
};
