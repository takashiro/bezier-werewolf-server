
class CenterCard {

	/**
	 * Center Card
	 * @param {number} pos
	 * @param {Role} role
	 */
	constructor(pos, role) {
		this.pos = pos;
		this.role = role;
	}

	/**
	 * Set role
	 * @param {Role} role
	 */
	setRole(role) {
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
	 * Convert the card into a number of its role
	 * @return {number}
	 */
	toNum() {
		return this.role.toNum();
	}

}

module.exports = CenterCard;
