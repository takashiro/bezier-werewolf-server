import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import SkillMode from '../../game/SkillMode';
import ExchangeAction from '../ExchangeAction';
import VisionSkill from '../VisionSkill';

export default class Robber extends VisionSkill {
	protected priority = 0x600;

	protected mode = SkillMode.ReadWrite;

	isFeasible(data: Selection): boolean {
		const target = this.selectPlayer(data);
		return Boolean(target) && target !== this.owner;
	}

	protected show(data: Selection): Vision | undefined {
		const target = this.selectPlayer(data);
		if (!target) {
			return;
		}

		this.driver.addAction(new ExchangeAction(this, this.owner, target));
		return this.showPlayer(this.owner, true);
	}
}
