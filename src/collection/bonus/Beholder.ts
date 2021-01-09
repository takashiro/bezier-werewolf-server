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
	protected priority = 0x1990;

	isFeasible(data: Selection): boolean {
		return this.selectNone(data);
	}

	protected show(): Vision {
		const players = this.driver.getPlayers();
		const seers = players.filter((player) => seerRoles.includes(player.getNotionalRole()));
		return this.showPlayers(seers, true);
	}
}
