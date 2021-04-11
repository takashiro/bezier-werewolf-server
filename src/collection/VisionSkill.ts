import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import Card from '../game/Card';
import Player from '../game/Player';
import Skill from './Skill';
import ViewAction from './ViewAction';

export default abstract class VisionSkill extends Skill<Vision | undefined> {
	protected run(data: Selection): Vision | undefined {
		if (!this.driver || !this.owner) {
			return;
		}
		return this.show(data);
	}

	protected showPlayer(player: Player, actual: boolean): Vision {
		const snapshot = actual ? player.getActualProfile() : player.getNotionalProfile();
		if (actual) {
			this.driver.addAction(new ViewAction(this, [player]));
		}
		return {
			players: [snapshot],
		};
	}

	protected showPlayers(players: Player[], actual: boolean): Vision {
		if (actual) {
			const snapshots = players.map((player) => player.getActualProfile());
			this.driver.addAction(new ViewAction(this, players));
			return {
				players: snapshots,
			};
		}

		const snapshots = players.map((player) => player.getNotionalProfile());
		return {
			players: snapshots,
		};
	}

	protected showCard(card: Card): Vision {
		const cards = [card.getProfile()];
		this.driver.addAction(new ViewAction(this, [card]));
		return {
			cards,
		};
	}

	protected showCards(cards: Card[]): Vision {
		const snapshots = cards.map((card) => card.getProfile());
		this.driver.addAction(new ViewAction(this, cards));
		return {
			cards: snapshots,
		};
	}

	/**
	 * Show the vision of a player
	 * @param data
	 * @return players or cards that can be seen
	 */
	protected abstract show(data: Selection): Vision | undefined;
}
