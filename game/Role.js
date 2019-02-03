
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
];

module.exports = Role;
