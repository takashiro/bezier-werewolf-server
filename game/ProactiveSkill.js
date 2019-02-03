
class ProactiveSkill {

	constructor(role) {
		this.role = role;
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
