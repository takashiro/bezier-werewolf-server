
const Role = require('../Role');
const ProactiveSkill = require('../ProactiveSkill');

class WerewolfCompanions extends ProactiveSkill {

	constructor() {
		super(Role.Werewolf);
	}

	takeEffect(driver, self) {
		const players = driver.players;
		const werewolves = players.filter(player => player.role === Role.Werewolf);
		return this.showPlayers(werewolves);
	}

}

module.exports = [WerewolfCompanions];
