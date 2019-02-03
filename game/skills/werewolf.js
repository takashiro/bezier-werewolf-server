
const Role = require('../Role');
const ProactiveSkill = require('../ProactiveSkill');

class WerewolfCompanions extends ProactiveSkill {

	constructor() {
		super(Role.Werewolf);
	}

	isFeasible(driver, self) {
		return !!driver && !!self;
	}

	takeEffect(driver, self) {
		const players = driver.players;
		const werewolves = players.filter(player => player.role === Role.Werewolf && player !== self);
		if (werewolves.length <= 0) {
			return werewolves;
		} else {
			return werewolves.map(wolf => wolf.seat);
		}
	}

}

module.exports = [WerewolfCompanions];
