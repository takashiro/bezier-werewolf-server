
class Action {

	/**
	 * An action to be executed
	 * @param {Player} owner
	 * @param {number} priority
	 */
	constructor(owner, priority) {
		this.owner = owner;
		this.priority = priority;
	}

	/**
	 * Get owner
	 * @return {Player}
	 */
	getOwner() {
		return this.owner;
	}

	/**
	 * Get priority
	 * @return {number}
	 */
	getPriority() {
		return this.priority;
	}

	/**
	 * Action effect
	 * @param {Driver} driver
	 */
	execute(driver) {
	}

}

module.exports = Action;
