
const Role = require('../Role');
const ProactiveSkill = require('../ProactiveSkill');
const ExchangeAction = require('../ExchangeAction');

class MakeTrouble extends ProactiveSkill {

	constructor() {
		super(Role.Troublemaker);
	}

	isFeasible(driver, self, data) {
		if (!driver || !self) {
			return false;
		}

		if (!data || !data.players) {
			return false;
		}

		const seats = data.players;
		if (!(seats instanceof Array) || seats.length !== 2) {
			return false;
		}

		const players = seats.map(seat => driver.getPlayer(seat));
		return players[0] !== players[1] && players.every(player => player && player !== self);
	}

	takeEffect(driver, self, data) {
		let player1 = driver.getPlayer(data.players[0]);
		let player2 = driver.getPlayer(data.players[1]);
		driver.addAction(new ExchangeAction(this.role, player1, player2));
	}

}

module.exports = MakeTrouble;
