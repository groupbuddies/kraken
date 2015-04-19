var R = require('ramda');
var Q = require('q');

var GitHubApi = require('github');
var OAuth2 = require('oauth').OAuth2;

var clientId = process.env.GITHUB_ID;
var clientSecret = process.env.GITHUB_SECRET;

var github = new GitHubApi({
  version: '3.0.0',
  debug: false,
  protocol: 'https',
  timeout: 5000
});

var oauth = new OAuth2(
  clientId,
  clientSecret,
  'https://github.com/',
  'login/oauth/authorize',
  'login/oauth/access_token'
);

var setAccessToken = function(token) {
  github.authenticate({
    type: 'oauth',
    token: token
  });
};

var accessTokenFromCode = function(code) {
  var deferred = Q.defer();

  oauth.getOAuthAccessToken(code, {}, function(err, accessToken) {
    if (err)
      deferred.reject(err);
    else
      deferred.resolve(accessToken);
  });

  return deferred.promise;
};

var setCode = function(code) {
  return accessTokenFromCode(code)
    .then(setAccessToken);
};

var redirectURL = function() {
  return oauth.getAuthorizeUrl({
    redirect_uri: 'http://localhost:3005/github/callback',
    scope: 'user,repo,gist'
  });
};

module.exports = {
  redirectURL: redirectURL,
  setCode: setCode,
  orgs: {
    addTeamMember: Q.denodeify(github.orgs.addTeamMember)
  }
};
