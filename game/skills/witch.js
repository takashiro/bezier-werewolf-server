
const Role = require('../Role');
const ProactiveSkill = require('../ProactiveSkill');
const ExchangeAction = require('../ExchangeAction');

const State = {
	Init: 0,
	CardSelected: 1,
	PlayerExchanged: 2,
};

class WitchPotion extends ProactiveSkill {

	constructor() {
		super(Role.Witch);
		this.stateNum = 2;
	}

	isFeasible(driver, self, data) {
		if (!super.isFeasible(driver, self, data)) {
			return false;
		}

		if (!isNaN(data.card)) {
			const card = driver.getCenterCard(data.card);
			return card && this.state <= State.CardSelected;
		} else if (!isNaN(data.player)) {
			const target = driver.getPlayer(data.player);
			return target && State.Init < this.state && this.state <= State.PlayerExchanged;
		} else {
			return false;
		}
	}

	takeEffect(driver, self, data) {
		if (this.state === State.Init) {
			const card = driver.getCenterCard(data.card);
			this.selectedCard = card;
			return this.showCards([card]);
		} else if (this.state === State.CardSelected) {
			if (!isNaN(data.player)) {
				const target = driver.getPlayer(data.player);
				driver.addAction(new ExchangeAction(self, 61, this.selectedCard, target));
				return this.showPlayers([{
					seat: target.seat,
					role: this.selectedCard.role,
				}]);
			} else if (!isNaN(data.card)) {
				this.nextState = this.state;
			}
		}
	}

}

module.exports = WitchPotion;
