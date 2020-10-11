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
