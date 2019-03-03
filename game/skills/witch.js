
const Role = require('../Role');
const ProactiveSkill = require('../ProactiveSkill');
const ExchangeAction = require('../ExchangeAction');

const State = {
	SelectCard: 0,
	SelectPlayer: 1,
};

class WitchPotion extends ProactiveSkill {

	constructor() {
		super(Role.Witch);
		this.stateNum = 2;
	}

	isInvoked(driver, self, data) {
		if (this.state > State.SelectPlayer) {
			return true;
		} else if (this.state > State.SelectCard) {
			return !isNaN(data.card);
		}
		return false;
	}

	isFeasible(driver, self, data) {
		if (!super.isFeasible(driver, self, data)) {
			return false;
		}

		if (this.state === State.SelectCard) {
			const card = driver.getCenterCard(data.card);
			return !!card;
		} else if (this.state === State.SelectPlayer) {
			const target = driver.getPlayer(data.player);
			return !!target;
		} else {
			return false;
		}
	}

	takeEffect(driver, self, data) {
		if (this.state === State.SelectCard) {
			const card = driver.getCenterCard(data.card);
			this.selectedCard = card;
			return this.showCards([card]);
		} else if (this.state === State.SelectPlayer) {
			const target = driver.getPlayer(data.player);
			driver.addAction(new ExchangeAction(self, 61, this.selectedCard, target));
			return this.showPlayers([{
				seat: target.seat,
				role: this.selectedCard.role,
			}]);
		}
	}

}

module.exports = WitchPotion;
