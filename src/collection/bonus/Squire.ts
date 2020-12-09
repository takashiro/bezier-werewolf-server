import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import VisionSkill from '../VisionSkill';
import isWerewolf from '../isWerewolf';

export default class Squire extends VisionSkill {
	protected priority = 930;

	isFeasible(data: Selection): boolean {
		return this.driver && !data.cards && !data.players;
	}

	protected show(): Vision {
		const players = this.driver.getPlayers();
		const werewolves = players.filter((player) => isWerewolf(player.getNotionalRole()));
		return Squire.showPlayers(werewolves);
	}
}
