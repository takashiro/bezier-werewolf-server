
const Role = require('../Role');
const Timing = require('../Timing');
const ProactiveSkill = require('../ProactiveSkill');
const VisionSkill = require('../VisionSkill');

class WerewolfVision extends VisionSkill {

	constructor() {
		super(Role.Werewolf, Role.Werewolf);
	}

}

class WerewolfCompanions extends ProactiveSkill {

	constructor() {
		super(Role.Werewolf);
	}

	takeEffect(driver, self) {
		const werewolves = driver.showVision(this.role);
		return this.showPlayers(werewolves);
	}

}

module.exports = [
	WerewolfCompanions,
	WerewolfVision,
];
