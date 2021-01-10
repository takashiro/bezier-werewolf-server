import {
	Role,
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import VisionSkill from '../VisionSkill';

export default class ApprenticeTanner extends VisionSkill {
	protected priority = 0x220;

	isFeasible(data: Selection): boolean {
		return this.selectNone(data);
	}

	protected show(): Vision {
		const players = this.driver.getPlayers();
		const tanners = players.filter((player) => player.getNotionalRole() === Role.Tanner);
		return this.showPlayers(tanners, false);
	}
}
