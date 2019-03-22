
const Role = require('../game/Role');
const Team = require('../game/Team');

function isWerewolf(role) {
	if (typeof role === 'number') {
		role = Role.fromNum(role);
	}
	return role.team === Team.Werewolf && role !== Role.Minion;
}

module.exports = isWerewolf;
