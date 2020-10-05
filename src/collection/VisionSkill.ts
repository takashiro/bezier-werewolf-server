import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import Card from '../game/Card';
import Event from '../game/Event';
import Player from '../game/Player';
import VisionStruct from './Vision';
import ProactiveSkill from './ProactiveSkill';

export default abstract class VisionSkill extends ProactiveSkill<Vision> {
	takeEffect(data: Selection): Vision {
		if (!this.driver || !this.owner) {
			return {};
		}

		const vision: VisionStruct = {
			viewer: this.owner,
			...this.show(data),
		};
		this.driver.trigger(Event.Visioning, vision);

		return {
			players: vision.players,
			cards: vision.cards,
		};
	}

	protected static showPlayers(players: Player[]): Vision {
		return {
			players: players.map((player) => player.getProfile()),
		};
	}

	protected static showCards(cards: Card[]): Vision {
		return {
			cards: cards.map((card) => card.toJSON()),
		};
	}

	/**
	 * Show the vision of a player
	 * @param data
	 * @return players or cards that can be seen
	 */
	protected abstract show(data: Selection): Vision;
}
