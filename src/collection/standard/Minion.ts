import {
	Role,
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import VisionSkill from '../VisionSkill';
import isWerewolf from '../isWerewolf';
import MutexType from '../../game/MutexType';

/**
 * A minion sees all the werewolves without their exact roles.
 */
export default class Minion extends VisionSkill {
	protected priority = 0x200;

	protected readMode = [MutexType.NotionalRole];

	isFeasible(data: Selection): boolean {
		return this.selectNone(data);
	}

	protected show(): Vision {
		const players = this.driver.getPlayers();
		const werewolves = players.filter((player) => isWerewolf(player.getNotionalRole()));
		return {
			players: werewolves.map((werewolf) => ({
				role: Role.Werewolf,
				seat: werewolf.getSeat(),
			})),
		};
	}
}
