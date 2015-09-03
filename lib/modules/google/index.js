var Q = require('q');
var google = require('googleapis');

var scopes = [
  'https://www.googleapis.com/auth/admin.directory.group',
  'https://www.googleapis.com/auth/admin.directory.user'
];

function authorize(client) {
  var deferred = Q.defer();
  client.authorize(deferred.makeNodeResolver());
  return deferred.promise;
}

function usersAdd(client, name, password) {
  return authorize(client)
    .then(function(tokens) {
      var admin = google.admin('directory_v1');

      var user = {
        resource: {
          name: {
            familyName: name,
            givenName: 'Snow'
          },
          password: password,
          primaryEmail: `${name}@subvisual.co`
        }
      };

      admin.users.insert(user, function(err) {
        console.log(err, err.stack);
      });
    });
}

module.exports = function(key) {
  var { client_email, private_key } = key;

  var jwtClient = new google.auth.JWT(
    client_email,
    null,
    private_key,
    scopes,
    'gabriel@subvisual.co'
  );

  return {
    users: {
      add: function(name, password) {
        return usersAdd(jwtClient, name, password);
      }
    }
  };
};
