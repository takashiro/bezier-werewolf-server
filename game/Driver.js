
class Driver {

	constructor() {
		this.roles = [];
	}

	/**
	 * Set roles
	 * @param {Role[]} roles
	 */
	setRoles(roles) {
		this.roles = roles;
	}

	/**
	 * Get roles
	 * @return {Role[]}
	 */
	getRoles() {
		return this.roles;
	}

}

module.exports = Driver;
