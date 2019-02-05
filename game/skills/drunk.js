
const Role = require('../Role');
const ProactiveSkill = require('../ProactiveSkill');
const ExchangeAction = require('../ExchangeAction');

class DrunkConfusion extends ProactiveSkill {

	constructor() {
		super(Role.Drunk);
	}

	isFeasible(driver, self, data) {
		if (!driver || !self || !data) {
			return false;
		}

		const card = driver.getCenterCard(data.card);
		return !!card;
	}

	takeEffect(driver, self, data) {
		const card = driver.getCenterCard(data.card);
		driver.addAction(new ExchangeAction(this.role, 80, self, card));
	}

}

module.exports = DrunkConfusion;
