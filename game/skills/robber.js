
const Role = require('../Role');
const ProactiveSkill = require('../ProactiveSkill');
const ExchangeAction = require('../ExchangeAction');

class Rob extends ProactiveSkill {

	constructor() {
		super(Role.Robber);
	}

	isFeasible(driver, self, data) {
		if (!driver || !self || !data || !data.target) {
			return false;
		}

		const target = driver.getPlayer(data.target);
		return target && target !== self;
	}

	takeEffect(driver, self, data) {
		const target = driver.getPlayer(data.target);
		driver.addAction(new ExchangeAction(this.role, 60, self, target));
		return {role: target.role.toNum()};
	}

}

module.exports = Rob;
