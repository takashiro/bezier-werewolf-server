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
	protected priority = 200;

	protected show(): Vision {
		const players = this.driver.getPlayers();
		const werewolves = players.filter((player) => {
			const role = player.getRole();
			return role !== Role.Minion && Teamship.get(role) === Team.Werewolf;
		});
		return {
			players: werewolves.map((werewolf) => ({
				role: Role.Werewolf,
				seat: werewolf.getSeat(),
			})),
		};
	}
}
