
const Role = require('../Role');
const ProactiveSkill = require('../ProactiveSkill');

class MasonWatch extends ProactiveSkill {

	constructor() {
		super(Role.Mason);
	}

	takeEffect(driver) {
		const players = driver.players;
		const masons = players.filter(player => player.role === Role.Mason);
		return this.showPlayers(masons);
	}

}

module.exports = MasonWatch;
