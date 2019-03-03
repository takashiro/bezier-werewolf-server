
const Role = require('../Role');
const ProactiveSkill = require('../ProactiveSkill');
const TransformAction = require('../TransformAction');
const VisionSkill = require('../VisionSkill');

class AlphaWolfCompanion extends VisionSkill {

	constructor() {
		super(Role.AlphaWolf, Role.Werewolf);
	}

}

const State = {
	MeetWerewolves: 0,
	Infect: 1,
};

class WolfInfection extends ProactiveSkill {

	constructor() {
		super(Role.AlphaWolf);
		this.stateNum = 2;
	}

	isInvoked(driver, self, data) {
		if (this.state > State.Infect) {
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
		} else if (this.state === State.Infect) {
			const target = driver.getPlayer(data.player);
			return target && target !== self;
		}

		return false;
	}

	takeEffect(driver, self, data) {
		if (this.state === State.MeetWerewolves) {
			const werewolves = driver.showVision(Role.Werewolf);
			return this.showPlayers(werewolves);

		} else if (this.state === State.Infect) {
			const target = driver.getPlayer(data.player);
			const action = new TransformAction(self, 21, target, Role.Werewolf);
			driver.addAction(action);
		}
	}

}

module.exports = [
	AlphaWolfCompanion,
	WolfInfection,
];
