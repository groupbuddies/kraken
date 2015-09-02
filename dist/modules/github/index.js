'use strict';

var Q = require('q');
var github = require('octonode');

module.exports = function (params) {
  var client = github.client(params);
  var team = client.team(971497);

  return {
    apprenticeship: {
      add: function add(username) {
        var deferred = Q.defer();
        team.addMembership(username, deferred.makeNodeResolver());
        return deferred.promise;
      }
    }
  };
};