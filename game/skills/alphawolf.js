
const Role = require('../Role');
const ProactiveSkill = require('../ProactiveSkill');
const TransformAction = require('../TransformAction');

class WolfInfection extends ProactiveSkill {

	constructor() {
		super(Role.AlphaWolf);
	}

	isFeasible(driver, self, data) {
		if (!super.isFeasible(driver, self, data)) {
			return false;
		}

		if (data.player) {
			const target = driver.getPlayer(data.player);
			return !!target && target !== self;
		}

		return false;
	}

	takeEffect(driver, self, data) {
		const target = driver.getPlayer(data.player);
		const action = new TransformAction(self, 21, target, Role.Werewolf);
		driver.addAction(action);
	}

}

module.exports = WolfInfection;
