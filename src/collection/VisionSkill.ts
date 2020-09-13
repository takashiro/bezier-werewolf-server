import {
	Vision as VisionData,
	Selection,
} from '@bezier/werewolf-core';

import Driver from '../game/Driver';
import Event from '../game/Event';
import ProactiveSkill from '../game/ProactiveSkill';
import Player from '../game/Player';

import Vision from './Vision';
import Card from '../game/Card';

export default abstract class VisionSkill extends ProactiveSkill<Player, Driver, Selection, VisionData> {
	isInvoked(data: Selection): boolean {
		return data && this.isUsed();
	}

	/**
	 * Show the vision of a player
	 * @param viewer
	 * @return players that can be seen
	 */
	protected showVision(viewer: Player): VisionData {
		if (!this.driver) {
			return {};
		}

		const vision: Vision = {
			viewer,
		};
		this.driver.trigger(Event.Visioning, vision);

		return {
			players: vision.players,
			cards: vision.cards,
		};
	}

	protected static showPlayers(players: Player[]): VisionData {
		return {
			players: players.map((player) => player.getProfile()),
		};
	}

	protected static showCards(cards: Card[]): VisionData {
		return {
			cards: cards.map((card) => card.toJSON()),
		};
	}
}