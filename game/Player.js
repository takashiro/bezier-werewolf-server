
class Player {

	constructor(seat) {
		this.seat = seat;
		this.seatKey = null;
		this.role = null;
	}

	/**
	 * Get seat
	 * @return {number}
	 */
	getSeat() {
		return this.seat;
	}

	/**
	 * Get seat key
	 * @return {number}
	 */
	getSeatKey() {
		return this.seatKey;
	}

	/**
	 * Set seat key
	 * @param {number} seatKey
	 */
	setSeatKey(seatKey) {
		this.seatKey = seatKey;
	}

	/**
	 * Get role
	 * @return {Role}
	 */
	getRole() {
		return this.role;
	}

	/**
	 * Set role
	 * @param {Role} role
	 */
	setRole(role) {
		this.role = role;
	}

}

module.exports = Player;
