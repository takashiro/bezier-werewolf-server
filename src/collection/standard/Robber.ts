import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import SkillMode from '../../game/SkillMode';
import ExchangeAction from '../ExchangeAction';
import VisionSkill from '../VisionSkill';

export default class Robber extends VisionSkill {
	protected priority = 600;

	protected mode = SkillMode.ReadWrite;

	isFeasible(data: Selection): boolean {
		if (!data.players) {
			return false;
		}

		const target = this.driver.getPlayer(data.players[0]);
		return Boolean(target) && target !== this.owner;
	}

	protected show(data: Selection): Vision {
		const target = data.players && this.driver.getPlayer(data.players[0]);
		if (!target) {
			return {};
		}

		this.driver.addAction(new ExchangeAction(this, this.owner, target));
		return Robber.showPlayers([this.owner]);
	}
}
