var R = require('ramda');
var Q = require('q');

var logger = require('../logger');
var spawn = require('child_process').spawn;

var express = require('express');

var API = require('./api');

var openAuthorizationURL = function() {
  spawn('open', [API.redirectURL()]);
};

var addTeamMember = function(id, user) {
  var options = { id: id, user: user };
  return API.orgs.addTeamMember(options);
};

module.exports = function(id, user) {
  var app = express();
  var server = app.listen(3005);

  var addTeamMemberFromArguments = R.curryN(3, addTeamMember)(id, user);

  process.on('exit', function() {
    server.close();
  });

  var deferred = Q.defer();

  app.get('/github/callback', function(req, res) {
    res.end('<script>window.close()</script>');

    return API.setCode(req.query.code)
      .then(addTeamMemberFromArguments)
      .then(function() {
        logger.info('User added to apprenticeship team on Github', user);
        deferred.resolve();
      })
      .catch(function(err) {
        logger.fatal('Failed to add o the apprenticeship team!\n %s', err, user);
        deferred.reject();
      });
  });

  openAuthorizationURL();

  return deferred.promise;
};
