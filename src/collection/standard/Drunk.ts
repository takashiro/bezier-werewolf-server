import { Selection } from '@bezier/werewolf-core';

import ExchangeAction from '../ExchangeAction';
import Skill from '../Skill';

class Drunk extends Skill<void> {
	isFeasible(data: Selection): boolean {
		if (!data.cards) {
			return false;
		}

		const card = this.driver.getCenterCard(data.cards[0]);
		return !!card;
	}

	protected run(data: Selection): void {
		if (!data.cards) {
			return;
		}

		const card = this.driver.getCenterCard(data.cards[0]);
		if (!card) {
			return;
		}

		this.driver.addAction(new ExchangeAction(this.owner, 80, this.owner, card));
	}
}

export default Drunk;
