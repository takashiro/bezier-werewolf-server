
const Role = require('../Role');
const ProactiveSkill = require('../ProactiveSkill');
const ExchangeAction = require('../ExchangeAction');

class Rob extends ProactiveSkill {

	constructor() {
		super(Role.Robber);
	}

	isFeasible(driver, self, data) {
		if (!driver || !self || !data || !data.player) {
			return false;
		}

		const target = driver.getPlayer(data.player);
		return target && target !== self;
	}

	takeEffect(driver, self, data) {
		const target = driver.getPlayer(data.player);
		driver.addAction(new ExchangeAction(this.role, 60, self, target));
		return this.showPlayers([{
			seat: self.seat,
			role: target.role,
		}]);
	}

}

module.exports = Rob;
