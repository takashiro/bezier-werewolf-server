import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import VisionSkill from '../VisionSkill';

export default class MysticWolf extends VisionSkill {
	isFeasible(data: Selection): boolean {
		if (!this.driver || !this.owner || !data.players) {
			return false;
		}
		const target = this.driver.getPlayer(data.players[0]);
		return Boolean(target) && target !== this.owner;
	}

	show(data: Selection): Vision {
		if (!this.driver || !this.owner || !data.players) {
			return {};
		}

		const target = this.driver.getPlayer(data.players[0]);
		if (target) {
			return MysticWolf.showPlayers([target]);
		}

		return {};
	}
}
