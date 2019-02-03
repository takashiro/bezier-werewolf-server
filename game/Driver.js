
const shuffle = require('../util/shuffle');
const Player = require('./Player');
const ProactiveSkill = require('./ProactiveSkill');
const PassiveSkill = require('./PassiveSkill');

function loadSkills() {
	this.proactiveSkills = new Map;
	this.passiveSkills = new Map;

	const skillClasses = require('./skills');

	for (const skillClass of skillClasses) {
		// Load passive skills
		if (PassiveSkill.isPrototypeOf(skillClass)) {
			let skill = new skillClass;
			if (this.roles.indexOf(skill.role) < 0) {
				continue;
			}

			let skills = this.passiveSkills.get(skill.timing);
			if (!skills) {
				skills = [];
				this.passiveSkills.set(skill.timing, skills);
			}
			skills.push(skill);;

		// Load proactive skills
		} else if (ProactiveSkill.isPrototypeOf(skillClass)) {
			for (const player of this.players) {
				let skill = new skillClass;
				if (player.role === skill.role) {
					player.setProactiveSkill(skill);
				}
			}
		}
	}
}

function arrangeRoles() {
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

class Driver {

	constructor() {
		this.roles = [];
		this.centerCards = [];
		this.players = [];
		this.proactiveSkills = null;
		this.passiveSkills = null;
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

	/**
	 * Start the game and arrange roles
	 */
	start() {
		arrangeRoles.call(this);
		loadSkills.call(this);
	}

	/**
	 * Trigger skills on a player
	 * @param {Timing} timing
	 * @param {Player|Player[]} target
	 * @param {object} data
	 */
	trigger(timing, target, data) {
		const skills = this.passiveSkills.get(timing);
		if (!skills) {
			return;
		}

		for (const skill of skills) {
			if (!skill.isTriggerable(this, target)) {
				continue;
			}

			let broken = skill.takeEfect(this, target, data);
			if (broken) {
				break;
			}
		}
	}

}

module.exports = Driver;
