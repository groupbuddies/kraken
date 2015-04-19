var addToTeam = require('./add_to_team');

var apprenticesTeamId = '971497';

module.exports = {
  addToTeam: addToTeam,
  addApprentice: function(username) {
    return addToTeam(apprenticesTeamId, username);
  }
};
