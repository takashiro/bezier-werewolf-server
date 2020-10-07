import {
	Role,
	Team,
	Teamship,
	Vision,
} from '@bezier/werewolf-core';

import VisionSkill from '../VisionSkill';

/**
 * A minion sees all the werewolves without their exact roles.
 */
export default class Minion extends VisionSkill {
	protected show(): Vision {
		if (!this.driver) {
			return {};
		}

		const players = this.driver.getPlayers();
		const werewolves = players.filter((player) => Teamship.get(player.getRole()) === Team.Werewolf);
		return {
			players: werewolves.map((werewolf) => ({
				role: Role.Werewolf,
				seat: werewolf.getSeat(),
			})),
		};
	}
}
