var Q = require('q');
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

var authorizationURL = function() {
  return oauth2Client.generateAuthUrl({
    access_type: 'online',
    scope: scopes
  });
};

var setCode = function(code) {
  var deferred = Q.defer();

  oauth2Client.getToken(code, function(err, tokens) {
    if (err)
      return deferred.reject(err);

    oauth2Client.setCredentials(tokens);
    deferred.resolve();
  });

  return deferred.promise;
};

module.exports = {
  authorizationURL: authorizationURL,
  setCode: setCode,
  admin: {
    users: {
      insert: function(options) {
        var admin = google.admin('directory_v1');
        return Q.nfcall(admin.users.insert, options);
      }
    }
  }
}
