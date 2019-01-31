
const shuffle = require('../util/shuffle');
const Player = require('./Player');
const SkillList = require('./skills');

class Driver {

	constructor() {
		this.roles = [];
		this.centerCards = [];
		this.players = [];
		this.skills = [];
	}

	/**
	 * Set roles
	 * @param {Role[]} roles
	 */
	setRoles(roles) {
		this.roles = roles;

		this.skills = [];
		for (const Skill of SkillList) {
			let skill = new Skill;
			if (roles.indexOf(skill.role) >= 0) {
				this.skills.push(skill);
			}
		}
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

	/**
	 * Start the game and arrange roles
	 */
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

	/**
	 * Trigger skills on a player
	 * @param {Timing} timing
	 * @param {Player|Player[]} target
	 * @param {object} data
	 */
	trigger(timing, target, data) {
		for (const skill of this.skills) {
			if (skill.timing !== timing) {
				continue;
			}

			if (!skill.triggerable(this, target)) {
				continue;
			}

			let broken = skill.effect(this, target, data);
			if (broken) {
				break;
			}
		}
	}

}

module.exports = Driver;
