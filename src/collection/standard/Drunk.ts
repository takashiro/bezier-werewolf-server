import { Selection } from '@bezier/werewolf-core';

import ExchangeAction from '../ExchangeAction';
import ProactiveSkill from '../ProactiveSkill';

class Drunk extends ProactiveSkill<void> {
	isFeasible(data: Selection): boolean {
		const driver = this.getDriver();
		if (!driver || !data.cards) {
			return false;
		}

		const card = driver.getCenterCard(data.cards[0]);
		return !!card;
	}

	takeEffect(data: Selection): void {
		const driver = this.getDriver();
		if (!driver || !this.owner || !data.cards) {
			return;
		}

		const card = driver.getCenterCard(data.cards[0]);
		if (!card) {
			return;
		}

		driver.addAction(new ExchangeAction(this.owner, 80, this.owner, card));
	}
}

export default Drunk;
