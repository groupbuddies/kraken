var R = require('ramda');
var Promise = require('promise');
var logger = require('../logger');
var spawn = require('child_process').spawn;
var express = require('express');
var GitHubApi = require('github');
var OAuth2 = require('oauth').OAuth2;

var clientId = process.env.GITHUB_ID;
var clientSecret = process.env.GITHUB_SECRET;

var oauth = new OAuth2(
  clientId,
  clientSecret,
  'https://github.com/',
  'login/oauth/authorize',
  'login/oauth/access_token'
);

var github = new GitHubApi({
  version: '3.0.0',
  debug: false,
  protocol: 'https',
  timeout: 5000
});

var openRedirectURL = function() {
  var redirectURL = oauth.getAuthorizeUrl({ 
    redirect_uri: 'http://localhost:3005/github/callback',
    scope: 'user,repo,gist'
  });

  spawn('open', [redirectURL]);
};

var setAccessToken = function(token) {
  github.authenticate({
    type: 'oauth',
    token: token
  });
};

var addTeamMember = function(user) {
  github.orgs.addTeamMember({ id: '971497', user: user }, function(err, res) {
    if (err) {
      logger.fatal('Failed to add %s to the apprenticeship team!\n %s', user, err);
    } else {
      logger.info('Successfully added %s user to the apprenticeship team', user);
    }
  }); 
};

var accessTokenFromCode = function(code) {
  return new Promise(function(resolve, reject) {
    oauth.getOAuthAccessToken(code, {}, function(err, accessToken) {
      if (err)
        reject(err);
      else
        resolve(accessToken);
    });
  });
};

module.exports = function(user) {
  var server,
      app = express();

  var addMemberFromArgs = R.curryN(2, addTeamMember)(user);

  app.get('/github/callback', function(req, res) {
    res.end('Success!');
    server.close();

    var code = req.query.code;

    return accessTokenFromCode(code)
      .then(setAccessToken)
      .then(addMemberFromArgs);
  });

  server = app.listen(3005);

  process.on('SIGTERM', function() {
    server.close();
  });

  openRedirectURL();
};
