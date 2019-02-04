
class Player {

	constructor(seat) {
		this.seat = seat;
		this.seatKey = null;
		this.role = null;
		this.input = null;
		this.lynchTarget = null;
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

	/**
	 * Set proactive skill
	 * @param {ProactiveSkill} skill
	 */
	setProactiveSkill(skill) {
		this.skill = skill;
	}

	/**
	 * Get proactive skill
	 * @return {ProactiveSkill}
	 */
	getProactiveSkill() {
		return this.skill;
	}

	/**
	 * Set lynch target
	 * @param {Player} target
	 */
	setLynchTarget(target) {
		this.lynchTarget = target;
	}

	/**
	 * Get lynch target
	 * @return {Player}
	 */
	getLynchTarget() {
		return this.lynchTarget;
	}

}

module.exports = Player;
