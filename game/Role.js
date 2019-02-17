
const Team = require('./Team');

let roleValue = 0;

class Role {

	/**
	 * Create a Role enum
	 * @param {string} key
	 * @param {Team} team
	 */
	constructor(key, team) {
		Role[key] = this;
		this.key = key;
		this.value = roleValue++;
		this.team = team;
	}

	/**
	 * Convert Role enum to number
	 * @return {number}
	 */
	toNum() {
		return this.value;
	}

	/**
	 * Convert number to Role enum
	 * @param {number} num
	 * @return {Role}
	 */
	static fromNum(num) {
		if (0 <= num && num < Role.enums.length) {
			return Role.enums[num];
		} else {
			return Role.Unknown;
		}
	}

}

Role.enums = [
	new Role('Unknown', Team.Unknown),

	new Role('Werewolf', Team.Werewolf),
	new Role('Villager', Team.Villager),
	new Role('Seer', Team.Villager),
	new Role('Tanner', Team.Tanner),
	new Role('Minion', Team.Werewolf),
	new Role('Troublemaker', Team.Villager),
	new Role('Robber', Team.Villager),
	new Role('Drunk', Team.Villager),
	new Role('Mason', Team.Villager),
	new Role('Hunter', Team.Villager),
];

module.exports = Role;
