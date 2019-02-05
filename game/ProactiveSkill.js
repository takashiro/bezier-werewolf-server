
class ProactiveSkill {

	constructor(role) {
		this.role = role;
		this.used = false;
	}

	/**
	 * Check if the skill has been invoked
	 * @return {boolean}
	 */
	isUsed() {
		return this.used;
	}

	/**
	 * Mark the skill as used / unused
	 * @param {boolean} used
	 */
	setUsed(used) {
		this.used = used;
	}

	/**
	 * Check if the selected targets are feasible to invoke the skill
	 * @param {Driver} driver
	 * @param {Player} self
	 * @param {*} data
	 */
	isFeasible(driver, self, data) {
		return !!driver && !!self;
	}

	/**
	 * Take effect on targets
	 * @param {Driver} driver
	 * @param {Player} self
	 * @param {*} data
	 * @return {object|undefined} data transfered to clients
	 */
	takeEffect(driver, self, data) {
	}

}

module.exports = ProactiveSkill;
