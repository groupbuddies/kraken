var R = require('ramda');
var Promise = require('promise');
var spawn = require('child_process').spawn;
var logger = require('../logger');
var express = require('express');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var clientId = process.env.GOOGLE_CLIENT_ID;
var clientSecret = process.env.GOOGLE_CLIENT_SECRET;
var redirectURL = 'http://localhost:3006/google/callback';

var oauth2Client = new OAuth2(clientId, clientSecret, redirectURL);
google.options({ auth: oauth2Client });

var scopes = [
  'https://www.googleapis.com/auth/admin.directory.user.readonly',
  'https://www.googleapis.com/auth/admin.directory.user'
];

var openAcceptURL = function() {
  var permissionsUrl = oauth2Client.generateAuthUrl({
    access_type: 'online',
    scope: scopes
  });

  spawn('open', [permissionsUrl]);
};

var userFromArgs = function(email, firstName, lastName) {
 return { 
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: firstName + 'password'
  };
}

var insertUser = function(user) {
  var admin = google.admin('directory_v1');

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

  return new Promise(function(resolve, reject) {
    admin.users.insert(options, function(err, res) {
      if (err)
        reject(err);
      else
        resolve();
    });
  });
};

var setTokenFromCode = function(code) {
  return new Promise(function(resolve, reject) {
    oauth2Client.getToken(code, function(err, tokens) {
      if (err)
        return reject(err);

      oauth2Client.setCredentials(tokens);
      resolve();
    });
  });
};

module.exports = function(email, firstName, lastName) {
  user = userFromArgs(email, firstName, lastName);

  var insertUserFromArgs = R.curryN(2, insertUser)(user);

  var server,
      app = express();

  app.get('/google/callback', function (req, res) {
    res.send('Success!');

    server.close();

    var code = req.query.code;

    setTokenFromCode(code)
      .then(insertUserFromArgs)
      .then(function() {
        logger.info(
          'Successfully created google account for %s with password %s.',
          user.email,
          user.password
        );
      })
      .catch(function() {
        logger.fatal(
          'Failed to create google account for %s.',
          user.email,
          user 
        );
      });
  });

  server = app.listen(3006);

  process.on('SIGTERM', function() {
    server.close();
  });

  openAcceptURL();
};
