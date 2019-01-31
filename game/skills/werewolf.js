
const Timing = require('../Timing');
const Role = require('../Role');
const Skill = require('../Skill');

class WerewolfCompanions extends Skill {

	constructor() {
		super(Timing.ShowRole, Role.Werewolf);
	}

	effect(driver, target, data) {
		const players = driver.players;
		const werewolves = players.filter(player => player.role === Role.Werewolf && player !== target);
		data.werewolves = werewolves.map(wolf => wolf.seat);
		return false;
	}

}

module.exports = [WerewolfCompanions];
