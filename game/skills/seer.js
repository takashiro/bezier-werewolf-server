
const Role = require('../Role');
const Player = require('../Player');
const ProactiveSkill = require('../ProactiveSkill');

class SeerForecast extends ProactiveSkill {

	constructor() {
		super(Role.Seer);
	}

	isFeasible(driver, self, data) {
		if (!driver || !data) {
			return false;
		}

		if (data.cards) {
			let cards = data.cards;
			return cards instanceof Array && cards.every(i => 0 <= i && i <= 2);
		} else if (data.player) {
			let player = driver.getPlayer(data.player);
			return !!player;
		}

		return false;
	}

	takeEffect(driver, self, data) {
		if (data.player) {
			let player = driver.getPlayer(data.player);
			return [player.role.toNum()];
		} else if (data.cards) {
			return data.cards.map(i => driver.centerCards[i].toNum());
		}
	}

}

module.exports = SeerForecast;
