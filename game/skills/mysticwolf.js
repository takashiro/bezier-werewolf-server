
const Role = require('../Role');
const ProactiveSkill = require('../ProactiveSkill');
const VisionSkill = require('../VisionSkill');

class MysticWolfCompanion extends VisionSkill {

	constructor() {
		super(Role.MysticWolf, Role.Werewolf);
	}

}

const State = {
	MeetWerewolves: 0,
	Forecast: 1,
};

class WolfForecast extends ProactiveSkill {

	constructor() {
		super(Role.MysticWolf);
		this.stateNum = 2;
	}

	isInvoked(driver, self, data) {
		if (this.state > State.Forecast) {
			return true;
		} else if (this.state > State.MeetWerewolves) {
			return !data.player;
		}
		return false;
	}

	isFeasible(driver, self, data) {
		if (!super.isFeasible(driver, self, data)) {
			return false;
		}

		if (this.state === State.MeetWerewolves) {
			return !data.player;
		} else if (this.state === State.Forecast) {
			const target = driver.getPlayer(data.player);
			return target && target !== self;
		}

		return false;
	}

	takeEffect(driver, self, data) {
		if (this.state === State.MeetWerewolves) {
			const werewolves = driver.showVision(Role.Werewolf);
			return this.showPlayers(werewolves);

		} else if (this.state === State.Forecast) {
			const target = driver.getPlayer(data.player);
			return this.showPlayers([target]);
		}
	}

}

module.exports = [
	MysticWolfCompanion,
	WolfForecast,
];
