import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import VisionSkill from '../VisionSkill';
import Card from '../../game/Card';
import isWerewolf from '../isWerewolf';

export default class LoneWolf extends VisionSkill {
	protected priority = 0x1301;

	isFinished(): boolean {
		if (super.isFinished() || !this.driver.isLoneWolf()) {
			return true;
		}

		const players = this.driver.getPlayers();
		const wolves = players.filter((player) => isWerewolf(player.getNotionalRole()));
		return wolves.length > 1;
	}

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
			return LoneWolf.showCards(cards);
		}
		return {};
	}
}
