
class Action {

	/**
	 * An action to be executed
	 * @param {Role} role
	 */
	constructor(role) {
		this.role = role;
	}

	/**
	 * Get role
	 * @return {Role}
	 */
	getRole() {
		return this.role;
	}

	/**
	 * Action effect
	 * @param {Driver} driver
	 */
	execute(driver) {
	}

}

module.exports = Action;
