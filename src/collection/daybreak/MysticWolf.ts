import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import VisionSkill from '../VisionSkill';

export default class MysticWolf extends VisionSkill {
	protected priority = 230;

	isFeasible(data: Selection): boolean {
		if (!data.players) {
			return false;
		}
		const target = this.driver.getPlayer(data.players[0]);
		return Boolean(target) && target !== this.owner;
	}

	show(data: Selection): Vision {
		const target = data.players && this.driver.getPlayer(data.players[0]);
		return target ? MysticWolf.showPlayers([target]) : {};
	}
}
