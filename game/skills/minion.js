
const Role = require('../Role');
const ProactiveSkill = require('../ProactiveSkill');

class MinionVision extends ProactiveSkill {

	constructor() {
		super(Role.Minion);
	}

	takeEffect(driver) {
		const werewolves = driver.showVision(Role.Werewolf);
		return this.showPlayers(werewolves);
	}

}

module.exports = MinionVision;
