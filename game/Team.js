
let teamValue = 0;

class Team {

	/**
	 * Create a Team enum
	 * @param {string} key
	 */
	constructor(key) {
		Team[key] = this;
		this.key = key;
		this.value = teamValue++;
	}

	/**
	 * Convert Team enum to number
	 * @return {number}
	 */
	toNum() {
		return this.value;
	}

	/**
	 * Convert number to Team enum
	 * @param {number} num
	 * @return {Team}
	 */
	static fromNum(num) {
		if (0 <= num && num < Team.enums.length) {
			return Team.enums[num];
		} else {
			Team.Unknown;
		}
	}

}

Team.enums = [
	new Team('Unknown'),

	new Team('Werewolf'),
	new Team('Villager'),
];

module.exports = Team;
