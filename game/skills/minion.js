
const Role = require('../Role');
const ProactiveSkill = require('../ProactiveSkill');

class MinionVision extends ProactiveSkill {

	constructor() {
		super(Role.Minion);
	}

	takeEffect(driver) {
		const players = driver.players;
		const werewolves = players.filter(player => player.role === Role.Werewolf);
		return this.showPlayers(werewolves);
	}

}

module.exports = MinionVision;
