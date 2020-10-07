import { Selection } from '@bezier/werewolf-core';

import ExchangeAction from '../ExchangeAction';
import Skill from '../Skill';

class Drunk extends Skill<void> {
	isFeasible(data: Selection): boolean {
		const driver = this.getDriver();
		if (!driver || !data.cards) {
			return false;
		}

		const card = driver.getCenterCard(data.cards[0]);
		return !!card;
	}

	protected run(data: Selection): void {
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
