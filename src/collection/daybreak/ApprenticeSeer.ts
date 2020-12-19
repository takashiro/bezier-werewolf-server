import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import VisionSkill from '../VisionSkill';
import Card from '../../game/Card';

export default class ApprenticeSeer extends VisionSkill {
	protected priority = 0x1520;

	isFeasible(data: Selection): boolean {
		if (!data || !data.cards) {
			return false;
		}

		const { cards } = data;
		if (cards.length > 1) {
			return false;
		}

		const [card] = cards;
		return Boolean(this.driver.getCenterCard(card));
	}

	protected show(data: Selection): Vision {
		const { driver } = this;
		if (data.cards) {
			const cards: Card[] = [];
			for (const i of data.cards) {
				const card = driver.getCenterCard(i);
				if (card) {
					cards.push(card);
				}
			}
			return ApprenticeSeer.showCards(cards);
		}
		return {};
	}
}
