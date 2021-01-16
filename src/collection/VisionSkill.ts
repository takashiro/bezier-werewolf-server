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
		if (actual) {
			this.driver.addAction(new ViewAction(this, [player]));
		}
		return {
			players: [actual ? player.getActualProfile() : player.getNotionalProfile()],
		};
	}

	protected showPlayers(players: Player[], actual: boolean): Vision {
		if (actual) {
			this.driver.addAction(new ViewAction(this, players));
		}
		return {
			players: actual
				? players.map((player) => player.getActualProfile())
				: players.map((player) => player.getNotionalProfile()),
		};
	}

	protected showCard(card: Card): Vision {
		this.driver.addAction(new ViewAction(this, [card]));
		return {
			cards: [card.getProfile()],
		};
	}

	protected showCards(cards: Card[]): Vision {
		this.driver.addAction(new ViewAction(this, cards));
		return {
			cards: cards.map((card) => card.getProfile()),
		};
	}

	/**
	 * Show the vision of a player
	 * @param data
	 * @return players or cards that can be seen
	 */
	protected abstract show(data: Selection): Vision | undefined;
}
