
class Action {

	/**
	 * An action to be executed
	 * @param {Role} role
	 * @param {number} priority
	 */
	constructor(role, priority) {
		this.role = role;
		this.priority = priority;
	}

	/**
	 * Get role
	 * @return {Role}
	 */
	getRole() {
		return this.role;
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
