import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import Card from '../game/Card';
import Player from '../game/Player';
import SkillMode from '../game/SkillMode';
import Skill from './Skill';

export default abstract class VisionSkill extends Skill<Vision> {
	protected mode = SkillMode.Read;

	protected run(data: Selection): Vision {
		if (!this.driver || !this.owner) {
			return {};
		}

		return this.show(data);
	}

	protected static showPlayer(player: Player, actual: boolean): Vision {
		return {
			players: [actual ? player.getActualProfile() : player.getNotionalProfile()],
		};
	}

	protected static showPlayers(players: Player[], actual: boolean): Vision {
		return {
			players: actual
				? players.map((player) => player.getActualProfile())
				: players.map((player) => player.getNotionalProfile()),
		};
	}

	protected static showCard(card: Card): Vision {
		return {
			cards: [card.getProfile()],
		};
	}

	protected static showCards(cards: Card[]): Vision {
		return {
			cards: cards.map((card) => card.getProfile()),
		};
	}

	/**
	 * Show the vision of a player
	 * @param data
	 * @return players or cards that can be seen
	 */
	protected abstract show(data: Selection): Vision;
}
