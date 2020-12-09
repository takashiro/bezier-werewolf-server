import {
	Role,
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import VisionSkill from '../VisionSkill';

export default class ApprenticeTanner extends VisionSkill {
	protected priority = 220;

	isFeasible(data: Selection): boolean {
		return this.driver && !data.cards && !data.players;
	}

	protected show(): Vision {
		const players = this.driver.getPlayers();
		const tanners = players.filter((player) => player.getNotionalRole() === Role.Tanner);
		return ApprenticeTanner.showPlayers(tanners);
	}
}
