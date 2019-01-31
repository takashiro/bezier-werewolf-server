
const shuffle = require('../util/shuffle');
const Player = require('./Player');

class Driver {

	constructor() {
		this.roles = [];
		this.centerCards = [];
		this.players = [];
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

	/**
	 * Get player
	 * @param {number} seat
	 * @return {Player}
	 */
	getPlayer(seat) {
		return this.players[seat - 1];
	}

	start() {
		let roles = Array.from(this.roles);
		shuffle(roles);

		this.centerCards = new Array(3);
		for (let i = 0; i < 3; i++) {
			this.centerCards[i] = roles[i];
		}

		const playerNum = roles.length - this.centerCards.length;
		this.players = new Array(playerNum);
		for (let i = 0; i < playerNum; i++) {
			let player = new Player(i + 1);
			player.setRole(roles[3 + i]);
			this.players[i] = player;
		}
	}

}

module.exports = Driver;
