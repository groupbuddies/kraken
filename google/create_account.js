var R = require('ramda');
var Q = require('q');
var spawn = require('child_process').spawn;

var Application = require('../application');
var logger = require('../logger');
var API = require('./api');
var User = require('../utils/user');
var express = require('express');

var successMessage = 'Successfully created google account for %s with password %s.';
var errorMessage = 'Failed to create google account for %s.';

var openAuthorizationURL = function() {
  spawn('open', [API.authorizationURL()]);
};

var insertUser = function(user) {
  var options = {
    resource: {
      name: {
        familyName: user.lastName,
        givenName: user.firstName
      },
      password: user.password,
      primaryEmail: user.email
    }
  };

  if (Application.development)
    return Q(true);
  else
    return API.admin.users.insert(options);
};

module.exports = function(user) {
  user = User.withPassword(user);

  var insertUserFromArgs = R.curryN(2, insertUser)(user);

  var app = express();
  var server = app.listen(3006);

  process.on('SIGTERM', function() {
    server.close();
  });

  var deferred = Q.defer();

  app.get('/google/callback', function (req, res) {
    res.end('<script>window.close()</script>');

    var code = req.query.code;

    API.setCode(code)
      .then(insertUserFromArgs)
      .then(function() {
        logger.info(successMessage, user.email, user.password);
        deferred.resolve();
      })
      .catch(function(err) {
        logger.fatal(errorMessage, user.email, user, err);
        deferred.reject();
      });
  });

  openAuthorizationURL();

  return deferred.promise;
};
