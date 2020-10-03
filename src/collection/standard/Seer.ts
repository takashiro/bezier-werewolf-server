import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import VisionSkill from '../VisionSkill';
import Card from '../../game/Card';

export default class Seer extends VisionSkill {
	isFeasible(data: Selection): boolean {
		if (!this.driver || !data) {
			return false;
		}

		if (data.cards) {
			const { cards } = data;
			return Array.isArray(cards) && cards.every((i) => i >= 0 && i <= 2);
		}

		if (data.players) {
			const { players } = data;
			if (players.length !== 1) {
				return false;
			}

			const [player] = players;
			return Boolean(this.driver.getPlayer(player));
		}

		return false;
	}

	takeEffect(data: Selection): Vision {
		const { driver } = this;
		if (!driver || !this.owner) {
			return {};
		}

		if (data.players) {
			const player = driver.getPlayer(data.players[0]);
			if (player) {
				return Seer.showPlayers([player]);
			}
		} else if (data.cards) {
			const cards: Card[] = [];
			for (const i of data.cards) {
				const card = driver.getCenterCard(i);
				if (card) {
					cards.push(card);
				}
			}
			return Seer.showCards(cards);
		}
		return {};
	}
}
