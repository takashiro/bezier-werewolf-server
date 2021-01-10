import {
	Role,
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import VisionSkill from '../VisionSkill';

export default class AuraSeer extends VisionSkill {
	protected priority = 0x730;

	isFeasible(data: Selection): boolean {
		return this.selectNone(data);
	}

	protected show(): Vision {
		const history = this.driver.getHistory();
		const players = history
			.filter((action) => action.getOrder() < this.getOrder())
			.map((action) => action.getOwner());
		return {
			players: players.map((player) => ({
				seat: player.getSeat(),
				role: Role.Unknown,
			})),
		};
	}
}
