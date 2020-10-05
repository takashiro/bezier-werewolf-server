import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import ExchangeAction from '../ExchangeAction';
import VisionSkill from '../VisionSkill';

export default class Robber extends VisionSkill {
	isFeasible(data: Selection): boolean {
		if (!this.driver || !this.owner || !data || !data.players) {
			return false;
		}

		const target = this.driver.getPlayer(data.players[0]);
		return Boolean(target) && target !== this.owner;
	}

	show(data: Selection): Vision {
		if (!this.driver || !this.owner || !data || !data.players) {
			return {};
		}

		const target = this.driver.getPlayer(data.players[0]);
		if (!target) {
			return {};
		}

		this.driver.addAction(new ExchangeAction(this.owner, 60, this.owner, target));

		const seen = {
			seat: this.owner.getSeat(),
			role: target.getRole(),
		};
		return {
			players: [seen],
		};
	}
}
