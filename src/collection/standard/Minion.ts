import {
	Role,
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import VisionSkill from '../VisionSkill';
import isWerewolf from '../isWerewolf';

/**
 * A minion sees all the werewolves without their exact roles.
 */
export default class Minion extends VisionSkill {
	protected priority = 200;

	isFeasible(data: Selection): boolean {
		return this.driver && !data.cards && !data.players;
	}

	protected show(): Vision {
		const players = this.driver.getPlayers();
		const werewolves = players.filter((player) => isWerewolf(player.getRolle()));
		return {
			players: werewolves.map((werewolf) => ({
				role: Role.Werewolf,
				seat: werewolf.getSeat(),
			})),
		};
	}
}
