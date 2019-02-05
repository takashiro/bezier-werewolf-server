
const shuffle = require('../util/shuffle');
const Player = require('./Player');
const CenterCard = require('./CenterCard');
const ProactiveSkill = require('./ProactiveSkill');
const PassiveSkill = require('./PassiveSkill');

const State = {
	Invalid: 0x0, // To avoid unexpected equation
	Starting: 0x1, // Users are taking seats
	Running: 0x2, // Players are voting for somebody to get lynched
	Stopping: 0x3, // Ready to execute skill effects
	Ended: 0x4, // The game is over
};

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
		this.centerCards[i] = new CenterCard(i, roles[i]);
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
		this.actions = [];
		this.finished = false;
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
	 * Get a center card
	 * @param {number} index
	 * @return {CenterCard}
	 */
	getCenterCard(index) {
		return this.centerCards[index];
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

	/**
	 * Add an action
	 * @param {Action} action
	 */
	addAction(action) {
		this.actions.push(action);
	}

	/**
	 * Get driver state
	 * @return {number}
	 */
	getState() {
		for (const player of this.players) {
			if (!player.getSeatKey()) {
				return State.Starting;
			}
		}

		for (const player of this.players) {
			if (!player.getLynchTarget()) {
				return State.Running;
			}
		}

		return this.finished ? State.Ended : State.Stopping;
	}

	/**
	 * Take all action effects.
	 */
	end() {
		if (this.finished) {
			return;
		}
		this.finished = true;

		this.actions.sort((a, b) => a.priority > b.priority);
		for (let action of this.actions) {
			action.execute(this);
		}
	}

}

Driver.State = State;

module.exports = Driver;
