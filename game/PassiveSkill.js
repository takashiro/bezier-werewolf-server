
class PassiveSkill {

	/**
	 * Create a skill
	 * @param {Timing} timing
	 * @param {Role} role
	 */
	constructor(timing, role) {
		this.timing = timing;
		this.role = role;
	}

	/**
	 * Check if this skill can be triggered
	 * @param {Driver} driver
	 * @param {Player} target
	 * @return {boolean}
	 */
	isTriggerable(driver, target) {
		return driver && target && target.getRole() === this.role;
	}

	/**
	 * Take effect
	 * @param {Driver} driver
	 * @param {Player} target
	 * @param {object} data
	 * @return {boolean} Whether to break following actions
	 */
	takeEffect(driver, target, data) {
		return false;
	}

}

module.exports = PassiveSkill;
