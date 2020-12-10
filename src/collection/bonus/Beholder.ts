import {
	Role,
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import VisionSkill from '../VisionSkill';

const seerRoles: Role[] = [
	Role.Seer,
	Role.ApprenticeSeer,
];

export default class Beholder extends VisionSkill {
	protected priority = 990;

	isFeasible(data: Selection): boolean {
		return this.driver && !data.cards && !data.players;
	}

	protected show(): Vision {
		const players = this.driver.getPlayers();
		const seers = players.filter((player) => seerRoles.includes(player.getNotionalRole()));
		return Beholder.showPlayers(seers);
	}
}
